package it.cosmonet.cosmoffice;
import android.app.Activity;
import android.content.pm.PackageManager;
import org.json.JSONObject;
import java.net.URL;
import java.io.ByteArrayInputStream;
import java.security.MessageDigest;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/** Uses real package signatures, files and updater; replaces only the HTTPS peer. */
final class UpdateChecks {
    static void require(boolean value, String why) { if (!value) throw new AssertionError(why); }
    static void waitPhase(AndroidUpdater updater, String phase) throws Exception {
        long deadline = System.currentTimeMillis() + 30000;
        while (System.currentTimeMillis() < deadline) { JSONObject state = updater.status(); if (phase.equals(state.getString("phase")) && !state.getBoolean("networkActive")) return; Thread.sleep(25); }
        throw new AssertionError("Stato aggiornamento atteso " + phase + ": " + updater.status());
    }
    static JSONObject release(Activity activity, byte[] apk) throws Exception {
        String cert = AndroidUpdater.hex(MessageDigest.getInstance("SHA-256").digest(activity.getPackageManager().getPackageInfo(activity.getPackageName(), PackageManager.GET_SIGNING_CERTIFICATES).signingInfo.getApkContentsSigners()[0].toByteArray()));
        return new JSONObject().put("format", "cosmoffice-android-update-v1").put("appId", activity.getPackageName()).put("versionName", "0.2.3").put("versionCode", 4).put("size", apk.length)
            .put("sha256", AndroidUpdater.hex(MessageDigest.getInstance("SHA-256").digest(apk))).put("certificateSha256", cert)
            .put("url", "https://github.com/CosmoNetinfo/CosmOffice/releases/download/android-v0.2.3-4/CosmOffice-0.2.3-android-4.apk");
    }
    static AndroidUpdater.Transport peer(byte[] apk, JSONObject release, AtomicInteger calls) {
        return (url, token) -> { calls.incrementAndGet(); require(UpdatePolicy.allowed(url, false), "URL vietato prima del peer");
            if (url.getPath().equals(UpdatePolicy.REPO)) return new ByteArrayInputStream("<a href=\"/CosmoNetinfo/CosmOffice/releases/tag/android-v0.2.3-4\">Versione</a>".getBytes(java.nio.charset.StandardCharsets.UTF_8));
            if (url.getPath().endsWith(".json")) return new ByteArrayInputStream(release.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return new ByteArrayInputStream(apk);
        };
    }
    static void run(Activity activity, byte[] fixture) throws Exception {
        URL origin = new URL("https://github.com/CosmoNetinfo/CosmOffice/releases/download/android-v0.2.3-4/ANDROID-UPDATE.json");
        for (String bad : new String[]{"http://github.com/CosmoNetinfo/CosmOffice/releases", "https://example.invalid/", "https://github.com/altro/repo/releases", "https://github.com:444/CosmoNetinfo/CosmOffice/releases", "https://github.com@evil.invalid/", "https://github.com/CosmoNetinfo/CosmOffice/releases?user=privato", "https://release-assets.githubusercontent.com/github-production-release-asset/1/0123456789012345?x=y"}) {
            require(!UpdatePolicy.allowed(new URL(bad), false), "URL vietato accettato");
            try { UpdatePolicy.redirect(origin, bad, true); throw new AssertionError("Redirect vietato accettato"); } catch (SecurityException expected) {}
        }
        require(UpdatePolicy.allowed(new URL("https://release-assets.githubusercontent.com/github-production-release-asset/1466711071/01234567-0123-0123-0123-012345678901?token=finto"), true), "CDN del solo repository");
        JSONObject manifest = release(activity, fixture); AtomicInteger calls = new AtomicInteger();
        try (AndroidUpdater updater = new AndroidUpdater(activity, state -> {}, peer(fixture, manifest, calls), 500)) {
            require(!updater.status().getBoolean("automatic"), "Automatici accesi senza consenso");
            updater.lifecycle(true); Thread.sleep(100); require(calls.get() == 0, "Richiesta all’avvio");
            updater.check(); waitPhase(updater, "ready"); require(calls.get() == 3, "Controllo e download una volta");
            require(!updater.status().getBoolean("networkActive"), "Rete rimasta attiva");
            updater.cancel(); updater.automatic(true); Thread.sleep(100); require(calls.get() == 3, "Automatici controllano all’attivazione");
            waitPhase(updater, "ready"); require(calls.get() >= 6, "Controllo periodico non eseguito"); updater.automatic(false);
            int ended = calls.get(); Thread.sleep(600); require(calls.get() == ended, "Richiesta dopo disattivazione");
        }
        for (String field : new String[]{"sha256", "certificateSha256", "url"}) {
            JSONObject bad = new JSONObject(manifest.toString()).put(field, field.equals("url") ? "https://evil.invalid/traccia.apk" : new String(new char[64]).replace('\0','0'));
            AtomicInteger count = new AtomicInteger();
            try (AndroidUpdater updater = new AndroidUpdater(activity, state -> {}, peer(fixture, bad, count))) { updater.check(); waitPhase(updater, "error"); require(!updater.status().getBoolean("networkActive"), "Errore lascia rete attiva"); if (field.equals("url")) require(count.get() == 2, "Contatto URL vietato"); }
        }
        CountDownLatch entered = new CountDownLatch(1), resume = new CountDownLatch(1); AtomicInteger count = new AtomicInteger();
        try (AndroidUpdater updater = new AndroidUpdater(activity, state -> {}, (url, token) -> { count.incrementAndGet(); entered.countDown(); resume.await(10, TimeUnit.SECONDS); return new ByteArrayInputStream(new byte[0]); })) {
            updater.check(); require(entered.await(5, TimeUnit.SECONDS), "Controllo non avviato"); updater.automatic(false); resume.countDown(); Thread.sleep(100);
            require(!updater.status().getBoolean("networkActive") && count.get() == 1, "Disattivazione non interrompe il controllo");
        }
        try (javax.net.ssl.SSLSocket socket = (javax.net.ssl.SSLSocket) new ModernTlsFactory(javax.net.ssl.HttpsURLConnection.getDefaultSSLSocketFactory()).createSocket()) {
            for (String protocol : socket.getEnabledProtocols()) require(protocol.equals("TLSv1.2") || protocol.equals("TLSv1.3"), "TLS obsoleto abilitato");
        }
    }
}
