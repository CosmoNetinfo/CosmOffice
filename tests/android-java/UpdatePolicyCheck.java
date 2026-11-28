package it.cosmonet.cosmoffice;
import java.net.URL;
public final class UpdatePolicyCheck {
    private static void check(boolean value) { if (!value) throw new AssertionError("Policy Android non rispettata"); }
    public static void main(String[] args) throws Exception {
        String base="https://github.com/CosmoNetinfo/CosmOffice/releases";
        check(UpdatePolicy.allowed(new URL(base),false));check(UpdatePolicy.allowed(new URL(base+"?page=2"),false));
        check(UpdatePolicy.allowed(new URL(base+"/download/android-v0.2.3-3/ANDROID-UPDATE.json"),false));
        check(UpdatePolicy.allowed(new URL(base+"/download/android-v0.2.3-3/CosmOffice-0.2.3-android-3.apk"),false));
        for(String bad:new String[]{"http://github.com/CosmoNetinfo/CosmOffice/releases",base+"?id=utente",base+"?page=4",base+"/download/android-v0.2.3-3/CosmOffice-0.2.3-android-4.apk","https://api.github.com/repos/CosmoNetinfo/CosmOffice/releases","https://github.com/altro/repo/releases","https://github.com.evil.invalid/CosmoNetinfo/CosmOffice/releases","https://github.com@evil.invalid/","https://github.com:444/CosmoNetinfo/CosmOffice/releases","https://release-assets.githubusercontent.com/github-production-release-asset/1/01234567890123456789?x=y"}) {
            check(!UpdatePolicy.allowed(new URL(bad),false));try{UpdatePolicy.redirect(new URL(base),bad,true);throw new AssertionError("Redirect vietato");}catch(SecurityException expected){}
        }
        check("android-v0.2.4-9".equals(UpdatePolicy.latestTag("<a href=\"/CosmoNetinfo/CosmOffice/releases/tag/android-v0.2.3-3\">A</a><a href=\"/CosmoNetinfo/CosmOffice/releases/tag/android-v0.2.4-9\">B</a>")));
        check(UpdatePolicy.code("android-v0.2.4-9")==9);check(UpdatePolicy.version("android-v0.2.4-9").equals("0.2.4"));
        try(javax.net.ssl.SSLSocket socket=(javax.net.ssl.SSLSocket)new ModernTlsFactory((javax.net.ssl.SSLSocketFactory)javax.net.ssl.SSLSocketFactory.getDefault()).createSocket()) {check(socket.getEnabledProtocols().length>0);for(String protocol:socket.getEnabledProtocols())check(protocol.equals("TLSv1.2")||protocol.equals("TLSv1.3"));}
        System.out.println("PASS policy Android: HTTPS TLS 1.2+, due host, solo repository, asset coerenti, redirect estranei bloccati e scelta del codice superiore.");
    }
}
