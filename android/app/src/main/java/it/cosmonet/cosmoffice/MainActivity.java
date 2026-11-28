package it.cosmonet.cosmoffice;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Intent;
import android.content.res.Configuration;
import android.database.Cursor;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.DocumentsContract;
import android.provider.OpenableColumns;
import android.util.Base64;
import android.view.WindowInsets;
import android.view.KeyEvent;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebMessage;
import android.webkit.WebMessagePort;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.RenderProcessGoneDetail;
import android.widget.FrameLayout;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import org.json.JSONObject;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Collections;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class MainActivity extends Activity {
    static final String ORIGIN = "https://appassets.androidplatform.net";
    private static final int MAX_FILE = 10 * 1024 * 1024;
    private static final int OPEN = 10, SAVE = 11, INPUT = 12;
    private static final Set<String> EXTENSIONS = new HashSet<>(Arrays.asList("docx", "xlsx", "pdf", "csv", "tsv", "txt", "html", "md", "json", "cosmoffice"));
    private final Handler main = new Handler(Looper.getMainLooper());
    private final ExecutorService io = Executors.newSingleThreadExecutor();
    private WebView web;
    private FrameLayout container;
    private WebMessagePort port;
    private Pending pending;
    private AndroidUpdater updater;
    private ValueCallback<Uri[]> inputCallback;
    private static final class Pending {
        private final String id, name; private final byte[] bytes;
        Pending(String id, String name, byte[] bytes) { this.id = id; this.name = name; this.bytes = bytes; }
        String id() { return id; } String name() { return name; } byte[] bytes() { return bytes; }
    }

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        updater = new AndroidUpdater(this, value -> {
            try { send(new JSONObject().put("event", "update").put("state", value)); } catch (Exception ignored) {}
        });
        android.webkit.ServiceWorkerController.getInstance().getServiceWorkerWebSettings().setBlockNetworkLoads(true);
        container = new FrameLayout(this);
        container.setBackgroundColor(Color.rgb(17, 27, 43));
        setContentView(container);
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            container.setOnApplyWindowInsetsListener((view, insets) -> {
                var safe = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                view.setPadding(safe.left, safe.top, safe.right, safe.bottom);
                return insets;
            });
        }
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(246, 247, 250));
        container.addView(web, new FrameLayout.LayoutParams(-1, -1));
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true); // Only URIs explicitly returned by the system file picker.
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setBlockNetworkLoads(true);
        settings.setSafeBrowsingEnabled(false); // No remote content or remote safety service.
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportMultipleWindows(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setUserAgentString(settings.getUserAgentString() + " CosmOfficeAndroid/1");
        if (Build.VERSION.SDK_INT >= 33) settings.setAlgorithmicDarkeningAllowed(false);
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !local(request.getUrl());
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (!local(uri) || !"GET".equals(request.getMethod())) return blocked();
                String name = uri.getPath();
                if (name == null || name.equals("/")) name = "/index.html";
                if (!name.matches("/[a-zA-Z0-9_@./+\\-]+") || name.contains("..")) return blocked();
                try {
                    InputStream content = getAssets().open("www" + name);
                    return new WebResourceResponse(mime(name), "UTF-8", 200, "OK",
                        assetHeaders(), content);
                } catch (Exception ignored) { return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", Collections.emptyMap(), new ByteArrayInputStream(new byte[0])); }
            }
            @Override public void onPageFinished(WebView view, String url) {
                if (!local(Uri.parse(url))) return;
                if (port != null) port.close();
                WebMessagePort[] channel = view.createWebMessageChannel();
                port = channel[0];
                port.setWebMessageCallback(new WebMessagePort.WebMessageCallback() {
                    @Override public void onMessage(WebMessagePort source, WebMessage message) {
                        String raw = message.getData();
                        if (raw == null || raw.length() > MAX_FILE * 4 / 3 + 8192) return;
                        io.execute(() -> {
                            try {
                                JSONObject call = new JSONObject(raw);
                                String id = call.optString("id");
                                if (!id.matches("[a-zA-Z0-9-]{1,64}")) return;
                                main.post(() -> handle(id, call));
                            } catch (Exception ignored) { /* Malformed input is never logged. */ }
                        });
                    }
                });
                view.postWebMessage(new WebMessage("cosmoffice:native-port:v1", new WebMessagePort[]{channel[1]}), Uri.parse(ORIGIN));
            }
            @Override public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                if (port != null) { port.close(); port = null; }
                container.removeView(view); view.destroy();
                web = null;
                LinearLayout fallback = new LinearLayout(MainActivity.this);
                fallback.setOrientation(LinearLayout.VERTICAL); fallback.setPadding(32, 60, 32, 32);
                TextView text = new TextView(MainActivity.this);
                text.setText(R.string.renderer_stopped);
                text.setTextColor(Color.WHITE); fallback.addView(text);
                Button retry = new Button(MainActivity.this); retry.setText(R.string.reopen);
                retry.setOnClickListener(v -> recreate()); fallback.addView(retry); container.addView(fallback);
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (pending != null || inputCallback != null) { callback.onReceiveValue(null); return true; }
                inputCallback = callback;
                Intent intent = params.createIntent();
                intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, downloads());
                try { startActivityForResult(intent, INPUT); }
                catch (Exception ignored) { inputCallback = null; callback.onReceiveValue(null); }
                return true;
            }
        });
        if (Build.VERSION.SDK_INT >= 33) getOnBackInvokedDispatcher().registerOnBackInvokedCallback(0, this::back);
        web.loadUrl(ORIGIN + "/index.html");
    }

    private static boolean local(Uri uri) {
        return "https".equals(uri.getScheme()) && "appassets.androidplatform.net".equals(uri.getHost())
            && uri.getPort() == -1 && uri.getUserInfo() == null;
    }
    private static Map<String, String> assetHeaders() {
        Map<String, String> headers = new HashMap<>();
        headers.put("Cache-Control", "no-store"); headers.put("X-Content-Type-Options", "nosniff");
        return headers;
    }
    private static WebResourceResponse blocked() {
        return new WebResourceResponse("text/plain", "UTF-8", 403, "Blocked", Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
    }
    private static String mime(String name) {
        if (name.endsWith(".html")) return "text/html";
        if (name.endsWith(".js") || name.endsWith(".mjs")) return "text/javascript";
        if (name.endsWith(".css")) return "text/css";
        if (name.endsWith(".json")) return "application/json";
        if (name.endsWith(".wasm")) return "application/wasm";
        if (name.endsWith(".svg")) return "image/svg+xml";
        if (name.endsWith(".png")) return "image/png";
        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
        if (name.endsWith(".woff2")) return "font/woff2";
        if (name.endsWith(".ttf")) return "font/ttf";
        if (name.endsWith(".otf")) return "font/otf";
        if (name.endsWith(".txt") || name.endsWith(".words")) return "text/plain";
        return "application/octet-stream";
    }
    private static Uri downloads() { return DocumentsContract.buildDocumentUri("com.android.externalstorage.documents", "primary:Download"); }
    private boolean dark() { return (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES; }
    private void send(JSONObject reply) {
        main.post(() -> { try { if (port != null) port.postMessage(new WebMessage(reply.toString())); } catch (Exception ignored) {} });
    }
    private void reply(String id, Object value) {
        try { send(new JSONObject().put("id", id).put("ok", true).put("value", value == null ? JSONObject.NULL : value)); } catch (Exception ignored) {}
    }
    private void fail(String id, String error) {
        try { send(new JSONObject().put("id", id).put("ok", false).put("error", error)); } catch (Exception ignored) {}
    }
    private void handle(String id, JSONObject call) {
        if (web == null || !local(Uri.parse(web.getUrl() == null ? "" : web.getUrl()))) return;
        try {
            switch (call.optString("operation")) {
                case "info" -> {
                    String version = WebView.getCurrentWebViewPackage() == null ? "" : WebView.getCurrentWebViewPackage().versionName;
                    reply(id, new JSONObject().put("os", Build.VERSION.RELEASE.replaceAll("[^0-9.]", ""))
                        .put("architecture", Build.SUPPORTED_ABIS[0]).put("webview", version).put("dark", dark()));
                }
                case "updates" -> {
                    switch (call.optString("action")) {
                        case "status" -> { }
                        case "check" -> updater.check();
                        case "cancel" -> updater.cancel();
                        case "automatic" -> updater.automatic(call.getBoolean("enabled"));
                        case "install" -> updater.install();
                        default -> { fail(id, "Comando aggiornamenti non valido."); return; }
                    }
                    reply(id, updater.status());
                }
                case "open" -> {
                    if (pending != null || inputCallback != null) { fail(id, "Completa prima il selettore file già aperto."); return; }
                    pending = new Pending(id, null, null);
                    Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("*/*");
                    intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, downloads());
                    startActivityForResult(intent, OPEN);
                }
                case "save" -> {
                    if (pending != null || inputCallback != null) { fail(id, "Completa prima il selettore file già aperto."); return; }
                    String name = call.optString("name"), type = call.optString("type", "application/octet-stream");
                    String ext = name.substring(name.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT);
                    if (name.trim().isEmpty() || name.length() > 160 || name.matches(".*[\\\\/\\p{Cntrl}].*") || !EXTENSIONS.contains(ext)) { fail(id, "Nome o formato del file non valido."); return; }
                    // Decode away from the UI thread; the provider opens only after validation.
                    io.execute(() -> {
                        try {
                            byte[] bytes = Base64.decode(call.optString("base64"), Base64.NO_WRAP);
                            if (bytes.length > MAX_FILE) { fail(id, "Android salva file fino a 10 MB."); return; }
                            main.post(() -> {
                                if (pending != null || inputCallback != null) { fail(id, "Completa prima il selettore file già aperto."); return; }
                                pending = new Pending(id, name, bytes);
                                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE)
                                    .setType(type.matches("[a-zA-Z0-9.+-]+/[a-zA-Z0-9.+-]+") ? type : "application/octet-stream");
                                intent.putExtra(Intent.EXTRA_TITLE, name).putExtra(DocumentsContract.EXTRA_INITIAL_URI, downloads());
                                try { startActivityForResult(intent, SAVE); } catch (Exception ignored) { pending = null; fail(id, "Selettore Android non disponibile."); }
                            });
                        } catch (Exception ignored) { fail(id, "Dati del file non validi."); }
                    });
                }
                case "clipboard" -> {
                    String text = call.optString("text");
                    if (text.length() > 16000 || !text.contains("Rapporto di debug CosmOffice")) { fail(id, "Rapporto non valido o troppo lungo."); return; }
                    ((ClipboardManager) getSystemService(CLIPBOARD_SERVICE)).setPrimaryClip(ClipData.newPlainText("Rapporto CosmOffice", text));
                    reply(id, true);
                }
                case "finish" -> { reply(id, true); finish(); }
                default -> fail(id, "Operazione Android non disponibile.");
            }
        } catch (Exception ignored) { pending = null; fail(id, "Operazione Android non riuscita."); }
    }

    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request == INPUT) {
            ValueCallback<Uri[]> callback = inputCallback; inputCallback = null;
            if (callback != null) {
                Uri uri = result == RESULT_OK && data != null ? data.getData() : null;
                callback.onReceiveValue(uri != null && "content".equals(uri.getScheme()) ? new Uri[]{uri} : null);
            }
            return;
        }
        if (request != OPEN && request != SAVE) return;
        Pending current = pending; pending = null;
        if (current == null) return;
        Uri uri = result == RESULT_OK && data != null ? data.getData() : null;
        if (uri == null) { reply(current.id(), null); return; }
        if (!"content".equals(uri.getScheme())) { fail(current.id(), "Il selettore non ha restituito un documento valido."); return; }
        io.execute(() -> {
            if (request == OPEN) {
                try {
                    String name; long size;
                    try (Cursor cursor = getContentResolver().query(uri, new String[]{OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE}, null, null, null)) {
                        if (cursor == null || !cursor.moveToFirst()) throw new IllegalArgumentException();
                        name = cursor.getString(0); size = cursor.isNull(1) ? -1 : cursor.getLong(1);
                    }
                    if (size > MAX_FILE) { fail(current.id(), "Android apre file fino a 10 MB."); return; }
                    if (name == null) name = "Documento";
                    name = name.replace('\\', '/'); name = name.substring(name.lastIndexOf('/') + 1);
                    byte[] content;
                    try (InputStream input = getContentResolver().openInputStream(uri); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
                        if (input == null) throw new IllegalArgumentException();
                        byte[] buffer = new byte[32768]; int count, total = 0;
                        while ((count = input.read(buffer)) != -1) {
                            total += count; if (total > MAX_FILE) { fail(current.id(), "Android apre file fino a 10 MB."); return; }
                            output.write(buffer, 0, count);
                        }
                        content = output.toByteArray();
                    }
                    reply(current.id(), new JSONObject().put("name", name).put("base64", Base64.encodeToString(content, Base64.NO_WRAP)));
                } catch (Exception ignored) { fail(current.id(), "Impossibile leggere il documento selezionato."); }
            } else {
                try {
                    try (OutputStream output = getContentResolver().openOutputStream(uri, "w")) {
                        if (output == null) throw new IllegalArgumentException();
                        output.write(current.bytes()); output.flush();
                    }
                    String savedName = current.name();
                    try (Cursor cursor = getContentResolver().query(uri, new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null)) {
                        if (cursor != null && cursor.moveToFirst() && cursor.getString(0) != null) savedName = cursor.getString(0);
                    } catch (Exception ignored) { /* File already closed successfully; retain the chosen name. */ }
                    reply(current.id(), new JSONObject().put("name", savedName));
                } catch (Exception ignored) {
                    try { DocumentsContract.deleteDocument(getContentResolver(), uri); } catch (Exception unused) {}
                    fail(current.id(), "Salvataggio non riuscito. Controlla la destinazione e l’eventuale copia incompleta; l’originale non viene riscritto.");
                }
            }
        });
    }

    private void back() {
        if (port == null) { finish(); return; }
        try { send(new JSONObject().put("event", "back")); } catch (Exception ignored) {}
    }
    @Override public boolean onKeyUp(int code, KeyEvent event) {
        // API 33+ uses the native OnBackInvokedDispatcher registered in onCreate.
        if (Build.VERSION.SDK_INT < 33 && code == KeyEvent.KEYCODE_BACK && !event.isCanceled()) { back(); return true; }
        return super.onKeyUp(code, event);
    }
    @Override public void onConfigurationChanged(Configuration config) {
        super.onConfigurationChanged(config);
        try { send(new JSONObject().put("event", "theme").put("dark", dark())); } catch (Exception ignored) {}
    }
    @Override protected void onPause() {
        if (web != null) web.evaluateJavascript("document.activeElement && document.activeElement.blur()", null);
        super.onPause();
    }
    @Override protected void onDestroy() {
        if (updater != null) updater.close();
        if (inputCallback != null) inputCallback.onReceiveValue(null);
        if (port != null) port.close();
        io.shutdown();
        if (web != null) web.destroy();
        super.onDestroy();
    }
    public WebView getWebView() { return web; }
    AndroidUpdater getUpdater() { return updater; }
    @Override protected void onStart() { super.onStart(); if (updater != null) updater.lifecycle(true); }
    @Override protected void onResume() { super.onResume(); if (updater != null) updater.installResult(); }
    @Override protected void onStop() { if (updater != null) updater.lifecycle(false); super.onStop(); }
}
