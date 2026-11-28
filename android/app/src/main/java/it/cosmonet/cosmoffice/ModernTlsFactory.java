package it.cosmonet.cosmoffice;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.SSLSocket;
import java.net.Socket;
import java.net.InetAddress;
import java.io.IOException;
import java.util.Arrays;
/** Restricts protocols; keeps the platform trust chain and hostname verification. */
final class ModernTlsFactory extends SSLSocketFactory {
    private final SSLSocketFactory delegate;
    ModernTlsFactory(SSLSocketFactory delegate) { this.delegate = delegate; }
    private Socket restrict(Socket socket) { SSLSocket ssl = (SSLSocket) socket; ssl.setEnabledProtocols(Arrays.stream(ssl.getSupportedProtocols()).filter(p -> p.equals("TLSv1.2") || p.equals("TLSv1.3")).toArray(String[]::new)); return socket; }
    public String[] getDefaultCipherSuites() { return delegate.getDefaultCipherSuites(); }
    public String[] getSupportedCipherSuites() { return delegate.getSupportedCipherSuites(); }
    public Socket createSocket() throws IOException { return restrict(delegate.createSocket()); }
    public Socket createSocket(Socket s, String h, int p, boolean close) throws IOException { return restrict(delegate.createSocket(s,h,p,close)); }
    public Socket createSocket(String h, int p) throws IOException { return restrict(delegate.createSocket(h,p)); }
    public Socket createSocket(String h, int p, InetAddress local, int lp) throws IOException { return restrict(delegate.createSocket(h,p,local,lp)); }
    public Socket createSocket(InetAddress h, int p) throws IOException { return restrict(delegate.createSocket(h,p)); }
    public Socket createSocket(InetAddress h, int p, InetAddress local, int lp) throws IOException { return restrict(delegate.createSocket(h,p,local,lp)); }
}
