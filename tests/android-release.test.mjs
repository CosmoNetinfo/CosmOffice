import test from 'node:test';import assert from 'node:assert/strict';
import{ANDROID_TAG,ANDROID_APK,androidManifest,androidNotes}from'../scripts/android-release-data.mjs';
const metadata={sha256:'a'.repeat(64),certificateSha256:'32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e',size:9000000};
test('Release Android: manifest coerente, stesso package e chiave, URL solo progetto',()=>{
 const result=androidManifest(metadata);assert.equal(result.versionCode,3);assert.equal(result.appId,'it.cosmonet.cosmoffice');assert.equal(result.url,`https://github.com/CosmoNetinfo/CosmOffice/releases/download/${ANDROID_TAG}/${ANDROID_APK}`);
 for(const bad of [{...metadata,size:0},{...metadata,size:100000000},{...metadata,sha256:'non hash'},{...metadata,certificateSha256:'b'.repeat(64)}])assert.throws(()=>androidManifest(bad));
});
test('Release Android: note derivate dal solo CHANGELOG, complete e senza confondere desktop',()=>{
 assert.throws(()=>androidNotes('## Altra versione'));
 const body=['Aggiunto','Modificato','Corretto','Limiti noti','Prove mancanti','Prossimi passi','Cosa ti aspetti da CosmOffice?'].map(t=>'### '+t+'\n\nContenuto originale.').join('\n\n');
 const notes=androidNotes('## [0.2.3-android.3] - 2026-11-28\n\n'+body+'\n\n## [0.2.2]\nNON INCLUDERE');assert.ok(notes.includes(body));assert.ok(!notes.includes('NON INCLUDERE'));assert.match(notes,/build 1\/2/);assert.match(notes,/latest.*invariati/);
});
