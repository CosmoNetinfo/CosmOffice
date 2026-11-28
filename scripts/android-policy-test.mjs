import {spawnSync} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {join,resolve} from 'node:path';
const folder=resolve('test-results/android/policy-check');await mkdir(folder,{recursive:true});
const java=name=>process.env.JAVA_HOME?join(process.env.JAVA_HOME,'bin',name+(process.platform==='win32'?'.exe':'')):name;
for(const[command,args]of[[java('javac'),['-encoding','UTF-8','-d',folder,'android/app/src/main/java/it/cosmonet/cosmoffice/UpdatePolicy.java','android/app/src/main/java/it/cosmonet/cosmoffice/ModernTlsFactory.java','tests/android-java/UpdatePolicyCheck.java']],[java('java'),['-cp',folder,'it.cosmonet.cosmoffice.UpdatePolicyCheck']]]) {
 const r=spawnSync(command,args,{encoding:'utf8',windowsHide:true});process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');if(r.error)throw r.error;if(r.status!==0)process.exit(r.status||1);
}
