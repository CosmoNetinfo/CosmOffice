package it.cosmonet.cosmoffice;

import android.app.Activity;
import android.app.Instrumentation;
import android.content.ClipboardManager;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.accessibility.AccessibilityNodeInfo;
import android.webkit.WebView;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.File;
import java.io.FileOutputStream;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

/** Instrumentation uses only Android's platform APIs. No test hook replaces the file picker or file I/O. */
public final class SmokeInstrumentation extends Instrumentation {
    private MainActivity activity;
    private int current;
    private static final int TOTAL = 8;
    @Override public void onCreate(Bundle args) { super.onCreate(args); start(); }
    private interface Check { void run() throws Exception; }
    private Bundle status(String name) {
        Bundle result = new Bundle(); result.putString("id", "CosmOfficeAndroid");
        result.putString("class", getClass().getName()); result.putString("test", name);
        result.putInt("numtests", TOTAL); result.putInt("current", current); return result;
    }
    private void step(String name, Check check) throws Exception {
        current++; sendStatus(1, status(name));
        try { check.run(); sendStatus(0, status(name)); }
        catch (Exception | AssertionError error) {
            Bundle failure = status(name); failure.putString("stack", error.toString()); sendStatus(-2, failure); throw error;
        }
    }
    private static void require(boolean value, String message) { if (!value) throw new AssertionError(message); }
    private String js(String expression) throws Exception {
        CountDownLatch done = new CountDownLatch(1); AtomicReference<String> result = new AtomicReference<>();
        runOnMainSync(() -> activity.getWebView().evaluateJavascript(expression, value -> { result.set(value); done.countDown(); }));
        require(done.await(15, TimeUnit.SECONDS), "JavaScript non risponde"); return result.get();
    }
    private void until(String condition) throws Exception {
        long end = System.currentTimeMillis() + 60000;
        while (System.currentTimeMillis() < end) {
            if ("true".equals(js("Boolean(" + condition + ")"))) return;
            Thread.sleep(150);
        }
        throw new AssertionError("Attesa scaduta: " + condition);
    }
    private void click(String label) throws Exception {
        String value = JSONObject.quote(label);
        String title = "(b.getAttribute('aria-label')||b.querySelector('strong')?.textContent.trim()||b.textContent.trim())";
        until("Array.from(document.querySelectorAll('button')).some(b=>" + title + "===" + value + "&&!b.disabled)");
        js("Array.from(document.querySelectorAll('button')).find(b=>" + title + "===" + value + ").click()");
    }
    private void input(String label, String text) throws Exception {
        String q = "document.querySelector('[aria-label=\"" + label + "\"]')";
        until(q);
        long deadline = System.currentTimeMillis() + 10000;
        AtomicReference<Boolean> focused = new AtomicReference<>(false);
        do {
            runOnMainSync(() -> focused.set(activity.hasWindowFocus() && activity.getWebView().requestFocusFromTouch()));
            if (focused.get()) break;
            Thread.sleep(100);
        } while (System.currentTimeMillis() < deadline);
        require(focused.get(), "Finestra Android non pronta per l’immissione");
        js(q + ".focus()");
        until("document.activeElement===" + q);
        if (label.startsWith("Cella ")) until("document.querySelector('.cell-address')?.textContent===" + JSONObject.quote(label.substring(6)));
        // Confirm selection through the Android input pipeline, not a DOM select
        // immediately followed by native events whose focus can still be stale.
        long stamp = android.os.SystemClock.uptimeMillis();
        sendKeySync(new android.view.KeyEvent(stamp, stamp, android.view.KeyEvent.ACTION_DOWN, android.view.KeyEvent.KEYCODE_A, 0, android.view.KeyEvent.META_CTRL_ON));
        sendKeySync(new android.view.KeyEvent(stamp, android.os.SystemClock.uptimeMillis(), android.view.KeyEvent.ACTION_UP, android.view.KeyEvent.KEYCODE_A, 0, android.view.KeyEvent.META_CTRL_ON));
        until(q + ".selectionStart===0&&" + q + ".selectionEnd===" + q + ".value.length");
        sendKeyDownUpSync(android.view.KeyEvent.KEYCODE_DEL);
        until(q + ".value===''");
        sendStringSync(text);
        until(q + ".value===" + JSONObject.quote(text));
        js(q + ".blur()"); // Normal onBlur commits the cell, without moving focus via Enter.
        until(q + ".value===" + JSONObject.quote(text));
    }
    private AccessibilityNodeInfo find(AccessibilityNodeInfo root, String text, String className) {
        if (root == null) return null;
        boolean same = text == null || root.getText() != null && text.equalsIgnoreCase(root.getText().toString());
        if (same && (className == null || className.contentEquals(root.getClassName())) && root.isVisibleToUser() && root.isEnabled()) return root;
        for (int i = 0; i < root.getChildCount(); i++) { AccessibilityNodeInfo found = find(root.getChild(i), text, className); if (found != null) return found; }
        return null;
    }
    private AccessibilityNodeInfo node(String text, String className) throws Exception {
        long end = System.currentTimeMillis() + 30000;
        while (System.currentTimeMillis() < end) {
            AccessibilityNodeInfo root = getUiAutomation().getRootInActiveWindow();
            String owner = root == null || root.getPackageName() == null ? "" : root.getPackageName().toString();
            // Wait for the real system picker. The app also has EditText nodes (document title/cells).
            if (!owner.equals("com.android.documentsui") && !owner.equals("com.google.android.documentsui")) {
                Thread.sleep(200); continue;
            }
            AccessibilityNodeInfo found = find(root, text, className);
            if (found != null && found.isVisibleToUser() && found.isEnabled()) return found;
            Thread.sleep(200);
        }
        throw new AssertionError("Controllo del selettore Android non trovato: " + text);
    }
    private void tap(String text) throws Exception {
        AccessibilityNodeInfo target = node(text, null);
        while (target != null && !target.isClickable()) target = target.getParent();
        require(target != null && target.isEnabled(), "Comando Android non attivabile: " + text);
        // A picker can close before acknowledging ACTION_CLICK. The caller must
        // verify the actual editor/export result; this return value is not success.
        target.performAction(AccessibilityNodeInfo.ACTION_CLICK);
    }
    private void open(String file) throws Exception { click("Apri un file"); tap(file); }
    private void home() throws Exception { click("Torna alle bozze"); until("document.querySelector('h1')?.textContent==='Il tuo spazio di lavoro.'"); }
    private void save(String button, String name) throws Exception {
        click(button);
        AccessibilityNodeInfo field = node(null, "android.widget.EditText");
        Bundle value = new Bundle(); value.putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, name);
        require(field.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, value), "Nome del file non modificabile nel selettore");
        node(name, "android.widget.EditText");
        screenshot("selettore-salvataggio");
        tap("SAVE");
        until("!document.querySelector('.busy')&&document.querySelector('.toast')?.textContent.includes('Copia esportata')&&document.querySelector('.toast').textContent.includes(" + JSONObject.quote(name) + ")");
    }
    private void screenshot(String name) throws Exception {
        getUiAutomation().waitForIdle(150, 5000);
        CountDownLatch painted = new CountDownLatch(1);
        runOnMainSync(() -> {
            WebView view = activity.getWebView();
            boolean external = name.equals("selettore-salvataggio") || name.equals("errore");
            if (view == null || external && !activity.hasWindowFocus()) { painted.countDown(); return; }
            view.postVisualStateCallback(System.nanoTime(), new WebView.VisualStateCallback() {
                @Override public void onComplete(long request) {
                    view.postOnAnimation(() -> view.postOnAnimation(painted::countDown));
                }
            });
        });
        require(painted.await(10, TimeUnit.SECONDS), "WebView non ha completato il frame della schermata");
        Bitmap bitmap = getUiAutomation().takeScreenshot(); require(bitmap != null, "Screenshot non disponibile");
        File directory = new File(getTargetContext().getFilesDir(), "smoke"); require(directory.exists() || directory.mkdirs(), "Cartella prove non disponibile");
        try (FileOutputStream output = new FileOutputStream(new File(directory, name + ".png"))) { bitmap.compress(Bitmap.CompressFormat.PNG, 100, output); }
        bitmap.recycle();
    }
    @Override public void onStart() {
        Bundle result = new Bundle();
        try {
            Intent launch = new Intent(getTargetContext(), MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            activity = (MainActivity) startActivitySync(launch);
            step("Avvio APK e permessi offline", () -> {
                until("document.querySelector('h1')?.textContent==='Il tuo spazio di lavoro.'");
                require(getTargetContext().checkSelfPermission("android.permission.INTERNET") != PackageManager.PERMISSION_GRANTED, "Permesso Internet presente");
                require("true".equals(js("location.origin==='https://appassets.androidplatform.net'")), "Origine locale inattesa");
                screenshot("home");
            });
            step("DOCX apri modifica salva riapri", () -> {
                open("android-write.docx"); until("document.querySelector('.document-page')");
                js("(()=>{const e=document.querySelector('.document-page');e.focus();const r=document.createRange();r.selectNodeContents(e);r.collapse(false);const s=getSelection();s.removeAllRanges();s.addRange(r);document.execCommand('insertText',false,' Android verificato.');})()");
                until("document.querySelector('.document-page').textContent.includes('Android verificato.')");
                screenshot("write"); save("Esporta DOCX", "android-write-salvato.docx"); home();
                open("android-write-salvato.docx"); until("document.querySelector('.document-page')?.textContent.includes('Android verificato.')"); home();
            });
            step("XLSX apri modifica salva riapri", () -> {
                open("android-grid.xlsx"); input("Cella B2", "701"); input("Cella B3", "2");
                until("document.querySelector('[aria-label=\"Cella B2\"]')?.value==='701'&&document.querySelector('[aria-label=\"Cella B3\"]')?.value==='2'");
                screenshot("grid"); save("Esporta XLSX", "android-grid-salvato.xlsx"); home();
                open("android-grid-salvato.xlsx"); until("document.querySelector('[aria-label=\"Cella B2\"]')?.value==='701'&&document.querySelector('[aria-label=\"Cella B3\"]')?.value==='2'"); home();
            });
            step("PDF visualizza ruota salva riapri", () -> {
                open("android-view.pdf");
                until("document.querySelector('.pdf-paper canvas')||document.querySelector('.toast')?.textContent.startsWith('Impossibile aprire il file:')");
                if (!"true".equals(js("Boolean(document.querySelector('.pdf-paper canvas'))"))) {
                    // Test APK only: inspect the original, purpose-written fixture. No user document/log hook.
                    String sample;
                    try (java.io.InputStream stream = getContext().getAssets().open("fixtures/android-view.pdf")) {
                        sample = android.util.Base64.encodeToString(stream.readAllBytes(), android.util.Base64.NO_WRAP);
                    }
                    js("window.__pdfDiagnostic=null;(async()=>{let task;try{const url=performance.getEntriesByType('resource').map(r=>r.name).find(u=>/\\/pdf-engine-[^/]+\\.js$/.test(u));if(!url)throw Error('Modulo PDF non caricato');const m=await import(url);task=m.createPdfTask(Uint8Array.from(atob(" + JSONObject.quote(sample) + "),c=>c.charCodeAt(0)));await task.promise;window.__pdfDiagnostic='PDF valido';}catch(e){window.__pdfDiagnostic=String(e?.stack||e).slice(0,1500);}finally{await task?.destroy();}})()");
                    until("window.__pdfDiagnostic!==null");
                    throw new AssertionError("PDF rifiutato; WebView " + WebView.getCurrentWebViewPackage().versionName + ": " + js("window.__pdfDiagnostic"));
                }
                until("document.querySelector('.pdf-paper canvas')?.width>0&&!document.querySelector('.pdf-loading')");
                screenshot("view"); click("Ruota pagina PDF"); save("Salva copia PDF", "android-view-salvato.pdf"); home();
                open("android-view-salvato.pdf"); until("document.querySelector('.pdf-paper canvas')?.width>0&&!document.querySelector('.pdf-loading')"); home();
            });
            step("Markdown crea salva riapri", () -> {
                click("Nuovo Markdown"); input("Testo Markdown", "# Android verificato\n\nTesto **originale** per le prove.\n");
                until("document.querySelector('.markdown-preview h1')?.textContent==='Android verificato'");
                save("Esporta MD", "android-note-salvate.md"); home(); open("android-note-salvate.md");
                until("document.querySelector('.markdown-preview h1')?.textContent==='Android verificato'"); sendKeyDownUpSync(4); until("document.querySelector('h1')?.textContent==='Il tuo spazio di lavoro.'");
            });
            step("Informazioni licenza locale e tema", () -> {
                click("Impostazioni"); click("Informazioni"); until("document.querySelector('[aria-label=\"Testo della licenza A\"]')?.value.includes('Daniele Spalletti')");
                screenshot("informazioni"); click("Aspetto");
                js("(()=>{const e=document.querySelector('[aria-label=\"Tema interfaccia\"]');e.value='dark';e.dispatchEvent(new Event('change',{bubbles:true}));})()");
                until("document.documentElement.dataset.theme==='dark'"); screenshot("impostazioni-scure");
            });
            step("Rapporto privacy e appunti Android", () -> {
                click("Segnala un problema"); until("document.querySelector('.debug-report textarea')||document.querySelector('textarea[readonly]')");
                click("Copia rapporto");
                until("document.querySelector('.debug-report [role=status]')?.textContent.includes('Rapporto copiato')");
                AtomicReference<String> copied = new AtomicReference<>();
                runOnMainSync(() -> { ClipboardManager clipboard = (ClipboardManager) activity.getSystemService(Activity.CLIPBOARD_SERVICE); copied.set(clipboard.getPrimaryClip().getItemAt(0).getText().toString()); });
                require(copied.get().contains("Rapporto di debug CosmOffice"), "Rapporto non copiato negli appunti reali");
                require(!copied.get().contains("android-write") && !copied.get().contains("Android verificato") && !copied.get().contains("/storage/"), "Dati privati presenti nel rapporto");
                screenshot("segnala-problema");
            });
            step("Nessuna connessione esterna", () -> {
                js("window.__cosmoNetworkResult=null;fetch('https://example.invalid/raccogli').then(r=>window.__cosmoNetworkResult=r.status===403&&r.statusText==='Blocked'?'BLOCCATO':'ERRORE',()=>window.__cosmoNetworkResult='BLOCCATO')");
                until("window.__cosmoNetworkResult==='BLOCCATO'");
            });
            result.putString("cosmoffice", "PASS"); result.putInt("prove", TOTAL);
            result.putString("stream", "\nPASS Android reale in emulatore: otto prove, selettore e filesystem reali, nessun permesso Internet.\n");
        } catch (Throwable error) {
            result.putString("cosmoffice", "FAIL"); result.putString("stream", "\nFAIL Android: " + error + "\n");
            try { result.putString("ui", js("JSON.stringify({home:document.querySelector('h1')?.textContent==='Il tuo spazio di lavoro.',grid:!!document.querySelector('.grid-editor'),markdown:!!document.querySelector('.markdown-source'),pdf:!!document.querySelector('.pdf-paper'),focused:document.hasFocus(),activeTag:document.activeElement?.tagName,selectionStart:document.activeElement?.selectionStart,selectionEnd:document.activeElement?.selectionEnd,valueLength:document.activeElement?.value?.length})")); } catch (Exception ignored) {}
            try { screenshot("errore"); } catch (Exception ignored) {}
        }
        finish(Activity.RESULT_OK, result);
    }
}
