package it.cosmonet.cosmoffice;

import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Closed network policy, independent of Android and of document contents. */
public final class UpdatePolicy {
    public static final String REPO = "/CosmoNetinfo/CosmOffice/releases";
    public static final Pattern TAG = Pattern.compile("android-v([0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3})-([1-9][0-9]{0,8})");
    private UpdatePolicy() {}
    public static boolean allowed(URL url, boolean releaseRedirect) {
        if (!"https".equals(url.getProtocol()) || url.getUserInfo() != null || url.getRef() != null || url.getPort() != -1 && url.getPort() != 443) return false;
        String path = url.getPath(), query = url.getQuery();
        if ("github.com".equals(url.getHost())) {
            if (path.equals(REPO)) return query == null || query.matches("page=[1-3]");
            if (query != null) return false;
            Matcher download = Pattern.compile(Pattern.quote(REPO) + "/download/(" + TAG.pattern() + ")/(ANDROID-UPDATE\\.json|CosmOffice-[0-9.]+-android-[1-9][0-9]*\\.apk)").matcher(path);
            if (!download.matches()) return false;
            String file = download.group(4);
            return file.equals("ANDROID-UPDATE.json") || file.equals("CosmOffice-" + download.group(2) + "-android-" + download.group(3) + ".apk");
        }
        return releaseRedirect && "release-assets.githubusercontent.com".equals(url.getHost())
            && path.matches("/github-production-release-asset/1466711071/[a-fA-F0-9-]{16,80}")
            && query != null && query.length() <= 8192;
    }
    public static String latestTag(String html) {
        Matcher links = Pattern.compile("href=\"" + Pattern.quote(REPO) + "/tag/(" + TAG.pattern() + ")\"").matcher(html);
        String tag = null; int code = -1;
        while (links.find()) { int candidate = Integer.parseInt(links.group(3)); if (candidate > code) { tag = links.group(1); code = candidate; } }
        return tag;
    }
    public static URL redirect(URL from, String location, boolean asset) throws Exception {
        URL target = new URL(from, location); if (!allowed(target, asset)) throw new SecurityException("Destinazione non consentita."); return target;
    }
    public static int code(String tag) { Matcher match = TAG.matcher(tag); if (!match.matches()) throw new IllegalArgumentException("Versione Android non valida."); return Integer.parseInt(match.group(2)); }
    public static String version(String tag) { Matcher match = TAG.matcher(tag); if (!match.matches()) throw new IllegalArgumentException("Versione Android non valida."); return match.group(1); }
}
