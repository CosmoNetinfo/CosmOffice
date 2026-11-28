export const ANDROID_VERSION = '0.2.3';
export const ANDROID_CODE = 3;
export const ANDROID_TAG = `android-v${ANDROID_VERSION}-${ANDROID_CODE}`;
export const ANDROID_APK = `CosmOffice-${ANDROID_VERSION}-android-${ANDROID_CODE}.apk`;
export function androidManifest({sha256, certificateSha256, size}) {
  if(!/^[a-f0-9]{64}$/.test(sha256)||certificateSha256!=='32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e'||!Number.isSafeInteger(size)||size<=0||size>64*1024*1024)throw Error('Metadati APK non validi.');
  return {format:'cosmoffice-android-update-v1',appId:'it.cosmonet.cosmoffice',versionName:ANDROID_VERSION,versionCode:ANDROID_CODE,size,sha256,certificateSha256,url:`https://github.com/CosmoNetinfo/CosmOffice/releases/download/${ANDROID_TAG}/${ANDROID_APK}`};
}
export function androidNotes(changelog) {
  const title=`## [${ANDROID_VERSION}-android.${ANDROID_CODE}]`;
  const start=changelog.indexOf(title);if(start<0)throw Error('Sezione Android del CHANGELOG assente.');
  const content=changelog.slice(start+title.length).replace(/^ - [^\n]+\n/,'\n').split(/\n## \[/)[0].trim();
  for(const heading of ['Aggiunto','Modificato','Corretto','Limiti noti','Prove mancanti','Prossimi passi','Cosa ti aspetti da CosmOffice?'])if(!content.includes('### '+heading))throw Error('Note incomplete: '+heading);
  return `# CosmOffice Android ${ANDROID_VERSION} (anteprima, build ${ANDROID_CODE})\n\n${content}\n\n## Download e installazione\n\nScarica ${ANDROID_APK}, verifica SHA-256 e aprilo su Android 10 o successivo. Installa come aggiornamento dell’app attuale, con la stessa firma. Da build 1/2 questo passaggio è manuale una volta; dalla build 3 usa «Controlla aggiornamenti ora» o attiva i periodici. L’installazione richiede conferma nell’app e nell’installatore Android.\n\nAPK firmato con la chiave CosmOffice, non pubblicato tramite Google Play. Documenti offline; rete nativa solo per le Release del progetto quando richiesta o dopo consenso ai periodici. Nessun account o telemetria. La Release desktop 0.2.3 e /releases/latest rimangono invariati.\n`;
}
