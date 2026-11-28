package it.cosmonet.cosmoffice;
import android.app.Activity;
import android.app.Instrumentation;
import android.content.Intent;
import android.os.Bundle;
import android.view.accessibility.AccessibilityNodeInfo;
import org.json.JSONObject;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

/** Upgrade/online phases dispatched by the registered runner; no switch in the application. */
final class UpdateInstallInstrumentation {
    private final Instrumentation instrumentation;
    private MainActivity activity;
    private boolean verify;
    private boolean online;
    UpdateInstallInstrumentation(Instrumentation instrumentation, String mode) { this.instrumentation = instrumentation; verify = "verify".equals(mode); online = "online".equals(mode); }
    private String js(String expression) throws Exception {
        CountDownLatch latch = new CountDownLatch(1); AtomicReference<String> value = new AtomicReference<>();
        instrumentation.runOnMainSync(() -> activity.getWebView().evaluateJavascript(expression, result -> { value.set(result); latch.countDown(); }));
        UpdateChecks.require(latch.await(10, TimeUnit.SECONDS), "WebView non risponde"); return value.get();
    }
    private void until(String condition) throws Exception { long end = System.currentTimeMillis()+60000; while(System.currentTimeMillis()<end){if("true".equals(js("Boolean("+condition+")")))return;Thread.sleep(100);}throw new AssertionError("Attesa: "+condition); }
    private AccessibilityNodeInfo find(AccessibilityNodeInfo node, String text) {
        if(node==null)return null;if(node.isVisibleToUser()&&node.isEnabled()&&node.getText()!=null&&text.equalsIgnoreCase(node.getText().toString()))return node;
        for(int n=0;n<node.getChildCount();n++){AccessibilityNodeInfo result=find(node.getChild(n),text);if(result!=null)return result;}return null;
    }
    private void tap(String text, boolean systemInstaller) throws Exception {
        long end=System.currentTimeMillis()+30000;
        while(System.currentTimeMillis()<end){AccessibilityNodeInfo root=instrumentation.getUiAutomation().getRootInActiveWindow();if(SmokeInstrumentation.dismissKnownEmulatorAnr(instrumentation,root)){Thread.sleep(100);continue;}String pkg=root==null||root.getPackageName()==null?"":root.getPackageName().toString();
            boolean owner=systemInstaller ? pkg.contains("packageinstaller")||pkg.contains("permissioncontroller") : pkg.equals("it.cosmonet.cosmoffice");
            AccessibilityNodeInfo node=owner?find(root,text):null;if(node!=null){while(node!=null&&!node.isClickable())node=node.getParent();if(node!=null){node.performAction(AccessibilityNodeInfo.ACTION_CLICK);return;}}Thread.sleep(100);
        }throw new AssertionError("Comando nativo assente: "+text);
    }
    private void home() throws Exception { js("document.querySelector('[aria-label=\"Torna alle bozze\"]').click()"); until("document.querySelector('h1')?.textContent==='Il tuo spazio di lavoro.'"); }
    private void draft(String name) throws Exception {
        until("Array.from(document.querySelectorAll('.file-name')).some(e=>e.textContent.includes("+JSONObject.quote(name)+"))");
        js("Array.from(document.querySelectorAll('.file-name')).find(e=>e.textContent.includes("+JSONObject.quote(name)+")).click()");
    }
    public void run() {
        Bundle result=new Bundle();
        try {
            long beforeTx=android.net.TrafficStats.getUidTxBytes(android.os.Process.myUid()),beforeRx=android.net.TrafficStats.getUidRxBytes(android.os.Process.myUid());
            activity=(MainActivity)instrumentation.startActivitySync(new Intent(instrumentation.getTargetContext(),MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
            until("document.querySelector('h1')?.textContent==='Il tuo spazio di lavoro.'");
            if(online){
                Thread.sleep(5000);
                UpdateChecks.require(beforeTx>=0&&beforeRx>=0,"Contatori traffico UID indisponibili");
                UpdateChecks.require(android.net.TrafficStats.getUidTxBytes(android.os.Process.myUid())==beforeTx&&android.net.TrafficStats.getUidRxBytes(android.os.Process.myUid())==beforeRx,"Traffico all’avvio con aggiornamenti spenti");
                UpdateChecks.require(activity.getUpdater().audit().length()==0,"Richiesta nativa implicita");
                activity.getUpdater().check();long end=System.currentTimeMillis()+90000;
                while(activity.getUpdater().status().getBoolean("networkActive")&&System.currentTimeMillis()<end)Thread.sleep(100);
                JSONObject status=activity.getUpdater().status();UpdateChecks.require(!status.getBoolean("networkActive")&&!"error".equals(status.getString("phase")),"Controllo live GitHub non riuscito: "+status);
                org.json.JSONArray audit=activity.getUpdater().audit();UpdateChecks.require(audit.length()>0,"Nessuna richiesta manuale");
                for(int n=0;n<audit.length();n++){String host=audit.getJSONObject(n).getString("host");UpdateChecks.require(host.equals("github.com")||host.equals("release-assets.githubusercontent.com"),"Host non consentito");}
                result.putString("online","PASS");result.putString("audit",audit.toString());result.putString("stream","PASS rete reale: zero byte UID all’avvio, controllo HTTPS GitHub manuale e trasporto spento al termine.\n");instrumentation.finish(Activity.RESULT_OK,result);return;
            }
            if(verify){
                UpdateChecks.require(activity.getPackageManager().getPackageInfo(activity.getPackageName(),0).getLongVersionCode()==4,"Nuovo APK non installato");
                UpdateChecks.require(!activity.getUpdater().status().getBoolean("automatic")&&activity.getUpdater().audit().length()==0,"Rete all’avvio dopo aggiornamento");
                until("document.documentElement.dataset.theme==='dark'");
                draft("android-write-salvato");until("document.querySelector('.document-page')?.textContent.includes('Android verificato.')");home();
                draft("android-grid-salvato");until("document.querySelector('[aria-label=\"Cella B2\"]')?.value==='701'&&document.querySelector('[aria-label=\"Cella B3\"]')?.value==='2'");home();
                draft("android-view-salvato");until("document.querySelector('.pdf-paper canvas')?.width>document.querySelector('.pdf-paper canvas')?.height&&!document.querySelector('.pdf-loading')");home();
                draft("android-note-salvate");until("document.querySelector('.markdown-preview h1')?.textContent==='Android verificato'");
                result.putString("upgrade","PASS");result.putString("stream","PASS aggiornamento reale con consenso Android: quattro bozze e tema mantenuti, versione 4, nessuna richiesta all’avvio.\n");instrumentation.finish(Activity.RESULT_OK,result);return;
            }
            byte[] fixture;try(java.io.InputStream input=instrumentation.getContext().getAssets().open("updates/future.apk")){fixture=input.readAllBytes();}
            AndroidUpdater updater=new AndroidUpdater(activity,state->{},UpdateChecks.peer(fixture,UpdateChecks.release(activity,fixture),new java.util.concurrent.atomic.AtomicInteger()));
            updater.check();UpdateChecks.waitPhase(updater,"ready");
            instrumentation.runOnMainSync(updater::install);tap("Annulla",false);
            UpdateChecks.require(activity.getPackageManager().getPackageInfo(activity.getPackageName(),0).getLongVersionCode()==3,"Annulla ha installato");
            instrumentation.runOnMainSync(updater::install);tap("Continua",false);
            // The action is performed on the real Android package-installer UI.
            Bundle marker=new Bundle();marker.putString("phase","USER_CONFIRMATION_REQUIRED");instrumentation.sendStatus(2,marker);
            tap("Update",true);
            // Updating our own package terminates this instrumentation process.
            Thread.sleep(30000);throw new AssertionError("Aggiornamento non ha sostituito il processo");
        }catch(Throwable error){result.putString("upgrade","FAIL");result.putString("stream",error.toString());instrumentation.finish(Activity.RESULT_OK,result);}
    }
}
