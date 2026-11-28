package it.cosmonet.cosmoffice;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInstaller;
import android.os.Build;

/** Private receiver used only by the explicit PackageInstaller PendingIntent. */
public final class UpdateInstallReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context context, Intent result) {
        int status = result.getIntExtra(PackageInstaller.EXTRA_STATUS, PackageInstaller.STATUS_FAILURE);
        if (status == PackageInstaller.STATUS_PENDING_USER_ACTION) {
            Intent confirmation = Build.VERSION.SDK_INT >= 33 ? result.getParcelableExtra(Intent.EXTRA_INTENT, Intent.class) : result.getParcelableExtra(Intent.EXTRA_INTENT);
            if (confirmation != null) try { context.startActivity(confirmation.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)); } catch (Exception ignored) {}
        } else context.getSharedPreferences("cosmoffice-updates-v1", 0).edit().putInt("lastInstallStatus", status).apply();
        // Never log EXTRA_STATUS_MESSAGE: it can contain installation paths.
    }
}
