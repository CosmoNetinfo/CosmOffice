package it.cosmonet.cosmoffice;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageInstaller;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.net.Uri;
import android.provider.Settings;
import org.json.JSONArray;
import org.json.JSONObject;
import javax.net.ssl.HttpsURLConnection;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayDeque;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;

/** Only this class can initiate app network requests. WebView network stays blocked. */
public final class AndroidUpdater implements AutoCloseable {
    static final long PERIOD = 6L * 60 * 60 * 1000, MAX_APK = 64L * 1024 * 1024;
    interface Transport { InputStream open(URL url, int token) throws Exception; }
    private final Activity activity;
    private final Consumer<JSONObject> notify;
    private final SharedPreferences preferences;
    private final Handler main = new Handler(Looper.getMainLooper());
    private final ExecutorService worker = Executors.newSingleThreadExecutor();
    private final AtomicInteger generation = new AtomicInteger();
    private final ArrayDeque<JSONObject> audit = new ArrayDeque<>();
    private final File apk;
    private final Transport transport;
    private final long periodMillis;
    private volatile HttpsURLConnection connection;
    private volatile boolean busy, automatic, started, closed, installing;
    private String phase = "idle", message = "Controlli automatici spenti. Nessuna connessione all’avvio.";
    private volatile JSONObject approved;
    private final Runnable periodic = new Runnable() { @Override public void run() { if (!closed && started && automatic) { check(); main.postDelayed(this, periodMillis); } } };
    public AndroidUpdater(Activity activity, Consumer<JSONObject> notify) { this(activity, notify, null); }
    AndroidUpdater(Activity activity, Consumer<JSONObject> notify, Transport testTransport) { this(activity, notify, testTransport, PERIOD); }
    AndroidUpdater(Activity activity, Consumer<JSONObject> notify, Transport testTransport, long interval) {
        this.activity = activity; this.notify = notify;
        periodMillis = interval;
        preferences = activity.getSharedPreferences("cosmoffice-updates-v1", 0);
        automatic = preferences.getBoolean("automatic", false);
        apk = new File(activity.getCacheDir(), "cosmoffice-update.apk");
        // Only our previous temporary, never a document selected by the user.
        if (apk.exists()) apk.delete();
        transport = testTransport == null ? this::https : testTransport;
        if (automatic) message = "Controlli ogni sei ore con l’app aperta. Nessun controllo all’avvio.";
    }
    public synchronized JSONObject status() {
        try { return new JSONObject().put("phase", phase).put("message", message).put("automatic", automatic).put("networkActive", busy).put("versionCode", BuildConfig.VERSION_CODE); }
        catch (Exception impossible) { throw new IllegalStateException(); }
    }
    private synchronized void state(String phase, String text) { this.phase = phase; message = text; JSONObject value = status(); main.post(() -> { if (!closed) notify.accept(value); }); }
    public synchronized JSONArray audit() { return new JSONArray(audit); }
    private synchronized void record(String kind, String host) {
        try { audit.add(new JSONObject().put("kind", kind).put("host", host)); while (audit.size() > 50) audit.removeFirst(); } catch (Exception ignored) {}
    }
    private void current(int token) throws InterruptedException { if (closed || generation.get() != token || !busy || Thread.currentThread().isInterrupted()) throw new InterruptedException(); }
    public void lifecycle(boolean value) { started = value; main.removeCallbacks(periodic); if (value && automatic) main.postDelayed(periodic, periodMillis); }
    public void installResult() {
        if (!preferences.contains("lastInstallStatus")) return;
        int result = preferences.getInt("lastInstallStatus", PackageInstaller.STATUS_FAILURE); preferences.edit().remove("lastInstallStatus").apply();
        state(result == PackageInstaller.STATUS_SUCCESS ? "current" : approved != null ? "ready" : "idle", result == PackageInstaller.STATUS_SUCCESS ? "Aggiornamento installato." : result == PackageInstaller.STATUS_FAILURE_ABORTED ? "Installazione annullata. Puoi riprovare." : "Installazione non riuscita. Puoi continuare a lavorare.");
    }
    public void automatic(boolean value) {
        automatic = value; preferences.edit().putBoolean("automatic", value).apply();
        main.removeCallbacks(periodic);
        if (!value) cancel(); else { if (started) main.postDelayed(periodic, periodMillis); state(phase, "Controlli attivati ogni sei ore con l’app aperta, mai all’avvio."); }
    }
    public synchronized void cancel() {
        generation.incrementAndGet(); busy = false; approved = null;
        HttpsURLConnection active = connection; if (active != null) active.disconnect();
        if (apk.exists()) apk.delete();
        state("idle", "Controllo interrotto. Puoi continuare a lavorare offline.");
    }
    private InputStream https(URL start, int token) throws Exception {
        URL url = start; boolean asset = start.getPath().startsWith(UpdatePolicy.REPO + "/download/");
        for (int redirect = 0; redirect <= 4; redirect++) {
            current(token);
            if (!UpdatePolicy.allowed(url, redirect > 0 && asset)) { record("blocked", "non consentito"); throw new SecurityException(); }
            record("request", url.getHost());
            HttpsURLConnection request = (HttpsURLConnection) url.openConnection(); connection = request;
            request.setSSLSocketFactory(new ModernTlsFactory(HttpsURLConnection.getDefaultSSLSocketFactory()));
            request.setInstanceFollowRedirects(false); request.setUseCaches(false); request.setConnectTimeout(15000); request.setReadTimeout(15000);
            request.setRequestMethod("GET"); request.setRequestProperty("User-Agent", "CosmOffice"); request.setRequestProperty("Accept-Encoding", "identity");
            // Default certificate and hostname verification; no custom permissive TLS hooks.
            current(token); int code = request.getResponseCode();
            if (code >= 300 && code < 400) { String location = request.getHeaderField("Location"); request.disconnect(); if (location == null) throw new SecurityException(); url = UpdatePolicy.redirect(url, location, asset); continue; }
            if (code != 200) { request.disconnect(); throw new java.io.IOException(); }
            return request.getInputStream();
        }
        throw new SecurityException();
    }
    private byte[] read(URL url, int token, int limit) throws Exception {
        if (!UpdatePolicy.allowed(url, false)) throw new SecurityException();
        try (InputStream input = transport.open(url, token); ByteArrayOutputStream bytes = new ByteArrayOutputStream()) {
            byte[] block = new byte[8192]; int count;
            while ((count = input.read(block)) != -1) { current(token); if (bytes.size() + count > limit) throw new java.io.IOException(); bytes.write(block, 0, count); }
            current(token); return bytes.toByteArray();
        } finally { HttpsURLConnection active = connection; if (active != null) active.disconnect(); connection = null; }
    }
    static JSONObject manifest(byte[] bytes, String tag) throws Exception {
        if (bytes.length > 16384) throw new SecurityException();
        JSONObject value = new JSONObject(new String(bytes, StandardCharsets.UTF_8));
        String version = UpdatePolicy.version(tag); int code = UpdatePolicy.code(tag);
        String expected = "https://github.com" + UpdatePolicy.REPO + "/download/" + tag + "/CosmOffice-" + version + "-android-" + code + ".apk";
        if (!(value.get("versionCode") instanceof Integer || value.get("versionCode") instanceof Long) || !(value.get("size") instanceof Integer || value.get("size") instanceof Long)) throw new SecurityException();
        if (!"cosmoffice-android-update-v1".equals(value.getString("format")) || !"it.cosmonet.cosmoffice".equals(value.getString("appId"))
            || !version.equals(value.getString("versionName")) || code != value.getInt("versionCode") || !expected.equals(value.getString("url"))
            || !value.getString("sha256").matches("[a-f0-9]{64}") || !value.getString("certificateSha256").matches("[a-f0-9]{64}")
            || value.getLong("size") <= 0 || value.getLong("size") > MAX_APK) throw new SecurityException();
        return value;
    }
    public synchronized void check() {
        if (busy || closed || installing) return;
        busy = true; approved = null; int token = generation.incrementAndGet(); state("checking", "Controllo della Release Android su GitHub…");
        worker.execute(() -> {
            try {
                String tag = null;
                for (int page = 1; page <= 3 && tag == null; page++) tag = UpdatePolicy.latestTag(new String(read(new URL("https://github.com" + UpdatePolicy.REPO + (page == 1 ? "" : "?page=" + page)), token, 1024 * 1024), StandardCharsets.UTF_8));
                current(token);
                if (tag == null || UpdatePolicy.code(tag) <= BuildConfig.VERSION_CODE) { state("current", tag == null ? "Nessuna Release Android disponibile. Puoi continuare offline." : "La versione Android installata è aggiornata."); return; }
                JSONObject release = manifest(read(new URL("https://github.com" + UpdatePolicy.REPO + "/download/" + tag + "/ANDROID-UPDATE.json"), token, 16384), tag);
                state("downloading", "Nuova versione: download e verifica SHA-256…");
                download(release, token); current(token); verify(apk, release, activity.getPackageManager(), activity.getPackageName());
                synchronized (this) { current(token); approved = release; state("ready", "Aggiornamento verificato. Installa soltanto dopo conferma tua e di Android."); }
            } catch (InterruptedException ignored) { /* cancel already changed the state */ }
            catch (Exception ignored) { if (generation.get() == token && !closed) { if (apk.exists()) apk.delete(); state("error", "Aggiornamento non disponibile. Puoi continuare a lavorare offline."); } }
            finally { if (generation.get() == token) { busy = false; JSONObject value = status(); main.post(() -> { if (!closed) notify.accept(value); }); } }
        });
    }
    private void download(JSONObject release, int token) throws Exception {
        URL url = new URL(release.getString("url")); if (!UpdatePolicy.allowed(url, false)) throw new SecurityException();
        try (InputStream input = transport.open(url, token); FileOutputStream output = new FileOutputStream(apk)) {
            MessageDigest digest = MessageDigest.getInstance("SHA-256"); byte[] block = new byte[65536]; int count; long size = 0;
            while ((count = input.read(block)) != -1) { current(token); size += count; if (size > release.getLong("size") || size > MAX_APK) throw new SecurityException(); output.write(block, 0, count); digest.update(block, 0, count); }
            output.getFD().sync(); current(token);
            if (size != release.getLong("size") || !hex(digest.digest()).equals(release.getString("sha256"))) throw new SecurityException();
        } finally { HttpsURLConnection active = connection; if (active != null) active.disconnect(); connection = null; }
    }
    static String hex(byte[] bytes) { StringBuilder text = new StringBuilder(); for (byte b : bytes) text.append(String.format(java.util.Locale.ROOT, "%02x", b & 255)); return text.toString(); }
    static void verify(File file, JSONObject release, PackageManager manager, String appId) throws Exception {
        MessageDigest hash = MessageDigest.getInstance("SHA-256"); try (InputStream input = new FileInputStream(file)) { byte[] block = new byte[65536]; int count; while ((count = input.read(block)) != -1) hash.update(block, 0, count); }
        if (file.length() != release.getLong("size") || !hex(hash.digest()).equals(release.getString("sha256"))) throw new SecurityException();
        PackageInfo candidate = manager.getPackageArchiveInfo(file.getAbsolutePath(), PackageManager.GET_SIGNING_CERTIFICATES);
        PackageInfo installed = manager.getPackageInfo(appId, PackageManager.GET_SIGNING_CERTIFICATES);
        if (candidate == null || !appId.equals(candidate.packageName) || candidate.getLongVersionCode() != release.getLong("versionCode")
            || candidate.getLongVersionCode() <= installed.getLongVersionCode() || !release.getString("versionName").equals(candidate.versionName)
            || candidate.signingInfo == null || installed.signingInfo == null || candidate.signingInfo.getApkContentsSigners().length != 1 || installed.signingInfo.getApkContentsSigners().length != 1) throw new SecurityException();
        String target = hex(MessageDigest.getInstance("SHA-256").digest(candidate.signingInfo.getApkContentsSigners()[0].toByteArray()));
        String current = hex(MessageDigest.getInstance("SHA-256").digest(installed.signingInfo.getApkContentsSigners()[0].toByteArray()));
        if (!target.equals(current) || !target.equals(release.getString("certificateSha256"))) throw new SecurityException();
    }
    public void install() {
        if (busy || installing || approved == null || !"ready".equals(phase)) return;
        new AlertDialog.Builder(activity).setTitle("Installare l’aggiornamento?").setMessage("Le bozze restano nell’app. Android chiederà un’ulteriore conferma; nessuna installazione silenziosa.")
            .setNegativeButton("Annulla", (dialog, which) -> {}).setPositiveButton("Continua", (dialog, which) -> {
                if (!activity.getPackageManager().canRequestPackageInstalls()) {
                    activity.startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + activity.getPackageName())));
                    state("ready", "Autorizza CosmOffice nelle impostazioni Android, poi premi di nuovo Installa."); return;
                }
                final JSONObject release = approved;
                final int installToken = generation.get(); installing = true;
                worker.execute(() -> {
                    int sessionId = -1;
                    try {
                        if (closed || release == null || generation.get() != installToken) throw new InterruptedException();
                        verify(apk, release, activity.getPackageManager(), activity.getPackageName());
                        PackageInstaller installer = activity.getPackageManager().getPackageInstaller();
                        PackageInstaller.SessionParams params = new PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL);
                        params.setAppPackageName(activity.getPackageName()); params.setSize(apk.length());
                        if (Build.VERSION.SDK_INT >= 31) params.setRequireUserAction(PackageInstaller.SessionParams.USER_ACTION_REQUIRED);
                        sessionId = installer.createSession(params);
                        try (PackageInstaller.Session session = installer.openSession(sessionId)) {
                            try (InputStream input = new FileInputStream(apk); java.io.OutputStream output = session.openWrite("base.apk", 0, apk.length())) {
                            MessageDigest digest = MessageDigest.getInstance("SHA-256"); byte[] block = new byte[65536]; int count;
                            while ((count = input.read(block)) != -1) { if (closed || generation.get() != installToken) throw new InterruptedException(); output.write(block, 0, count); digest.update(block, 0, count); }
                            session.fsync(output); if (!hex(digest.digest()).equals(release.getString("sha256"))) throw new SecurityException();
                            }
                            Intent result = new Intent(activity, UpdateInstallReceiver.class).setAction("it.cosmonet.cosmoffice.INSTALL_" + sessionId);
                            PendingIntent callback = PendingIntent.getBroadcast(activity, sessionId, result, PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 31 ? PendingIntent.FLAG_MUTABLE : 0));
                            if (closed || generation.get() != installToken) throw new InterruptedException();
                            session.commit(callback.getIntentSender());
                        }
                        state("ready", "Conferma l’aggiornamento nella finestra di Android.");
                    } catch (Exception ignored) {
                        if (sessionId >= 0) try { activity.getPackageManager().getPackageInstaller().abandonSession(sessionId); } catch (Exception ignoredAgain) {}
                        if (!closed && generation.get() == installToken) state("error", "Installazione non avviata. Puoi continuare a lavorare.");
                    } finally { installing = false; }
                });
            }).show();
    }
    @Override public void close() { closed = true; generation.incrementAndGet(); main.removeCallbacks(periodic); HttpsURLConnection active = connection; if (active != null) active.disconnect(); worker.shutdownNow(); }
}
