# Android build 2: PDF e Promise.withResolvers sul telefono

## 1. Obiettivo

Correggere il difetto segnalato dal titolare sul telefono fisico: «Impossibile aprire il file: Promise.withResolvers is not a function». Preparare un APK con stessa firma, aggiornabile sopra il primo, e una regressione che copra l’API assente. Nessun documento personale richiesto o acquisito.

## 2. Cosa hai fatto

- scripts/android-webview-compat.mjs: supporto originale, piccolo e senza dipendenze, basato sul normale costruttore Promise. Installato solo se l’API nativa manca; successo/rifiuto, sottoclassi, descrittore e costruttori non validi verificati. Nessun codice di altre librerie copiato.
- scripts/android-prepare.mjs: supporto prima di tutti i chunk Android e prefisso del worker PDF, che ha un contesto separato. La sola patch alla pagina non basta. Directory generata ripulita dopo guardia realpath, input worker rimosso dopo il build; nessuna modifica di node_modules.
- scripts/android-pdf-browser.mjs: API eliminata dalla pagina e dal vero worker, oltre a URL.parse. Tre PDF originali (testo/scansione/venti pagine) aperti/renderizzati/ruotati/esportati/riaperti, rotazione 90° con pdf-lib; zero richieste esterne e nessun fake worker accettato. Porta file simulata, dichiarata.
- tests/android.test.mjs: tre nuovi test di compatibilità; totale unitari da 75 a 78.
- android/app/build.gradle: solo versionCode 1→2. VersionName 0.2.3, package, firma, origine WebView e schema delle bozze invariati.
- scripts/android-check-apk.mjs: verifica code 2 e presenza del supporto prima del motore nella pagina/worker del vero APK. Nessun permesso nuovo.
- README.md, CHANGELOG.md, docs/ANDROID.md, BUG.md (AND-015), DECISIONI.md, ROADMAP.md, VALIDATION.md, ricerca/CODICE-STUDIATO.md, questo report e ULTIMO.md.
- APK firmato locale e copia di consegna CosmOffice-0.2.3-Android-2.apk con checksum e LEGGIMI-build-2.txt. Vecchio APK conservato separatamente, non sovrascritto. Certificato e package verificati su entrambi, codice nuovo superiore.
- Non toccati src/, electron/, MainActivity, motori DOCX/XLSX/PDF, dizionario/condizioni LICENSE, rapporto tester/Prova guidata, aggiornamenti desktop e pacchetti/Release pubblici. Nessuna dipendenza aggiunta; scripts/notices.mjs eseguito, attribuzioni invariate.

## 3. Esiti reali di build e test

Il precedente risultato dell’emulatore non copriva il WebView del telefono: WebView 124 ha Promise.withResolvers, il telefono segnalato no. Versione precisa del telefono/WebView non nota. [Android 46110959197](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46110959197), commit 7705967, aveva otto success ma non certificava questa variante. [Ultima CI desktop prima di questo fix 46112196943](https://github.com/CosmoNetinfo/CosmOffice/actions/runs/46112196943), commit 672e0a4, osservata completed/success con tutti sei i lavori. La nuova CI di questo commit partirà dopo il push: non è ancora dichiarata verde in questo report.

Controlli negativi conservati: prima correzione, test senza API fallisce in timeout; usando poi i veri asset del vecchio APK, il controllo negativo più diagnostico riproduce esattamente il messaggio del titolare. Il fallimento è previsto e dimostra la regressione, non viene contato come successo della vecchia app.

### Prima del fix, API rimossa — exit 1

```text
node:internal/modules/run_main:111
    triggerUncaughtException(
    ^

page.waitForFunction: Timeout 30000ms exceeded.
    at rendered (<progetto>\scripts\android-pdf-browser.mjs:45:31)
    at <progetto>\scripts\android-pdf-browser.mjs:46:88 {
  log: [],
  name: 'TimeoutError'
}

Node.js v26.13.1
```

### Vecchio APK, errore atteso identico allo screenshot — processo interno exit 1; harness negativo exit 0

```text
node:internal/modules/run_main:111
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: PDF rifiutato: Impossibile aprire il file: Promise.withResolvers is not a function
    at rendered (file:///<progetto>/test-results/android/promise-old-pdf-test.mjs:46:12)
    at async file:///<progetto>/test-results/android/promise-old-pdf-test.mjs:51:82 {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '==',
  diff: 'simple'
}

Node.js v26.13.1
```

### Tre PDF dopo il fix — exit 0

```text
PASS PDF senza Promise.withResolvers in pagina/worker: 01-testo.pdf
PASS PDF senza Promise.withResolvers in pagina/worker: 02-scansione.pdf
PASS PDF senza Promise.withResolvers in pagina/worker: 03-venti-pagine.pdf
PASS asset Android di produzione senza URL.parse e Promise.withResolvers; API assente anche nel vero worker PDF, senza fake worker. PDF renderizzato, ruotato, esportato e riaperto; 90 gradi verificati, zero richieste esterne. Porta nativa simulata: non è il test APK.
```

Il primo controllo statico dell’APK falliva perché cercava il nome della funzione, rimosso dal minificatore: non era un errore del build o del motore. Corretto a controllare Object.defineProperty(Promise,withResolvers) nei primi 2048 caratteri, sia in pagina sia nel worker; i test comportamentali restano obbligatori e invariati. Nessun controllo eliminato. Output reale del fallimento:

### Controllo APK iniziale — exit 1

```text
node:internal/modules/run_main:111
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: compatibilità Promise incorporata prima dell’esecuzione
    at file:///<progetto>/scripts/android-check-apk.mjs:25:10 {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: 'typeof Promise.withResolvers!=`function`&&Object.defineProperty(Promise,"withResolvers",{configurable:!0,writable:!0,enumerable:!1,value:function(){let e=this,t,n,r=new e((e,r)=>{if(t!==void 0||n!==void 0)throw TypeError(`Esecutore Promise già inizializzato.`);t=e,n=r});if(typeof t!=`function`||typeof n!=`function`)throw TypeError(`Costruttore Promise non valido.`);return{promise:r,resolve:t,reject:n}}});var e={463(e){var t=TypeError;e.exports=function(e){if(typeof e==`string`)return e;throw new t(`Argument is not a string`)}},804(e){var t=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`,n=t+`+/`,r=t+`-_`,i=function(e){for(var t={},n=0;n<64;n++)t[e.charAt(n)]=n;return t};e.exports={i2c:n,c2i:i(n),i2cUrl:r,c2iUrl:i(r)}},529(e){e.exports=function(e,t){return{value:e,done:t}}},837(e){var t=TypeError,n=9007199254740991;e.exports=function(e){if(e>n)throw new t(`Maximum allowed index exceeded`);return e}},2(e){e.exports={IndexSizeError:{s:`INDEX_SIZE_ERR`,c:1,m:1},DOMStringSizeError:{s:`DOMSTRING_SIZE_ERR`,c:2,m:0},HierarchyRequestError:{s:`HIERARCHY_REQUEST_ERR`,c:3,m:1},WrongDocumentError:{s:`WRONG_DOCUMENT_ERR`,c:4,m:1},InvalidCharacterError:{s:`INVALID_CHARACTER_ERR`,c:5,m:1},NoDataAllowedError:{s:`NO_DATA_ALLOWED_ERR`,c:6,m:0},NoModificationAllowedError:{s:`NO_MODIFICATION_ALLOWED_ERR`,c:7,m:1},NotFoundError:{s:`NOT_FOUND_ERR`,c:8,m:1},NotSupportedError:{s:`NOT_SUPPORTED_ERR`,c:9,m:1},InUseAttributeError:{s:`INUSE_ATTRIBUTE_ERR`,c:10,m:1},InvalidStateError:{s:`INVALID_STATE_ERR`,c:11,m:1},SyntaxError:{s:`SYNTAX_ERR`,c:12,m:1},InvalidModificationError:{s:`INVALID_MODIFICATION_ERR`,c:13,m:1},NamespaceError:{s:`NAMESPACE_ERR`,c:14,m:1},InvalidAccessError:{s:`INVALID_ACCESS_ERR`,c:15,m:1},ValidationError:{s:`VALIDATION_ERR`,c:16,m:0},TypeMismatchError:{s:`TYPE_MISMATCH_ERR`,c:17,m:1},SecurityError:{s:`SECURITY_ERR`,c:18,m:1},NetworkError:{s:`NETWORK_ERR`,c:19,m:1},AbortError:{s:`ABORT_ERR`,c:20,m:1},URLMismatchError:{s:`URL_MISMATCH_ERR`,c:21,m:1},QuotaExceededError:{s:`QUOTA_EXCEEDED_ERR`,c:22,m:1},TimeoutError:{s:`TIMEOUT_ERR`,c:23,m:1},InvalidNodeTypeError:{s:`INVALID_NODE_TYPE_ERR`,c:24,m:1},DataCloneError:{s:`DATA_CLONE_ERR`,c:25,m:1}}},944(e){var t=TypeError;e.exports=function(e){var n=e&&e.alphabet;if(n===void 0||n===`base64`||n===`base64url`)return n||`base64`;throw new t("Incorrect `alphabet` option")}},767(e){e.exports=function(e){return{iterator:e,next:e.next,done:!1}}},117(e){e.exports=function(e){return e==null}},859(e){e.exports=function(e){e.iterator=e.next=e.nextHandler=e.mapper=e.predicate=e.inner=e.iterables=e.iters=e.openIters=e.padding=e.finishResults=e.buffer=null}},684(e){e.exports=function(e,t){var n=typeof Iterator==`function`&&Iterator.prototype[e];if(n)try{n.call({next:null},t).next()}catch{return!0}}},269(e){e.exports=Object.create?Object.create(null):{}},741(e){var t=Math.ceil,n=Math.floor;e.exports=Math.trunc||function(e){var r=+e;return(r>0?n:t)(r)}},149(e){var t=RangeError;e.exports=function(e){if(e===e)return e;throw new t(`NaN is not allowed`)}},717(e,t){t.f=Object.getOwnPropertySymbols},103(e){e.exports=function(e){try{return{error:!1,value:e()}}catch(e){return{error:!0,value:e}}}},750(e,t,n){var r=n(117),i=TypeError;e.exports=function(e){if(r(e))throw new i(`Can\'t call method on `+e);return e}},835(e){e.exports=function(e){try{var t=new Set,n=t[e]({size:0,has:function(){return!0},keys:function(){return Object.defineProperty({},"next",{get:function(){return t.clear(),t.add(4),function(){return{done:!0}}}})}});return n.size===1&&n.values().next().value===4}catch{return!1}}},291(e,t,n){var r=n(741);e.exports=function(e){var t=+e;return t!==t||t===0?0:r(t)}},14(e,t,n){var r=n(291),i=Math.min;e.exports=function(e){var t=r(e);return t>0?i(t,9007199254740991):0}},981(e,t,n){var r=n(750),i=Object;e.exports=function(e){return i(r(e))}},590(e,t,n){var r=n(291),i=RangeError;e.exports=function(e){var t=r(e);if(t<0)throw new i(`The argument can\'t be less than 0`);return t}},812(e){var t=TypeError;e.exports=function(e,n){if(e<n)throw new t(`Not enough arguments`);return e}}},t={};function n(r){let i=t[r];if(i!==void 0)return i.exports;let a=t[r]={exports:{}};return e[r](a,a.exports,n),a.exports}n.cw=e=>{var t;return()=>{if(e){var n=e;e=0,t={exports:{}},n.call(t.exports,t,t.exports)}return t.exports}},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var r=n.cw(e=>{var t=Ie(),n=en(),r=TypeError;e.exports=function(e){if(t(e))return e;throw new r(n(e)+` is not a function`)}}),i=n.cw(e=>{var t=Be(),n=String,r=TypeError;e.exports=function(e){if(t(e))return e;throw new r(`Can\'t set `+n(e)+` as a prototype`)}}),a=n.cw(e=>{var t=Dt().has;e.exports=function(e){return t(e),e}}),o=()=>n(463),s=n.cw(e=>{var t=un(),n=new t.WeakMap,r=t.set,i=t.remove;e.exports=function(e){return r(n,e,1),i(n,e),e}}),c=n.cw(e=>{var t=un().has;e.exports=function(e){return t(e),e}}),l=n.cw(e=>{var t=dn(),n=st(),r=lt().f,i=t(`unscopables`),a=Array.prototype;a[i]===void 0&&r(a,i,{configurable:!0,value:n(null)}),e.exports=function(e){a[i][e]=!0}}),u=n.cw(e=>{var t=mt(),n=TypeError;e.exports=function(e,r){if(t(r,e))return e;throw new n(`Incorrect invocation`)}}),d=n.cw(e=>{var t=ze(),n=String,r=TypeError;e.exports=function(e){if(e===void 0||t(e))return e;throw new r(n(e)+` is not an object or undefined`)}}),f=n.cw(e=>{var t=ze(),n=String,r=TypeError;e.exports=function(e){if(t(e))return e;throw new r(n(e)+` is not an object`)}}),p=n.cw(e=>{var t=E(),n=TypeError;e.exports=function(e){if(t(e)===`Uint8Array`)return e;throw new n(`Argument is not an Uint8Array`)}}),m=n.cw(e=>{e.exports=typeof ArrayBuffer<`u`&&typeof DataView<`u`}),h=n.cw(e=>{var t=R(),n=he(),r=T(),i=t.ArrayBuffer,a=t.TypeError;e.exports=i&&n(i.prototype,`byteLength`,`get`)||function(e){if(r(e)!==`ArrayBuffer`)throw new a(`ArrayBuffer expected`);return e.byteLength}}),g=n.cw(e=>{var t=R(),n=m(),r=h(),i=t.DataView;e.exports=function(e){if(!n||r(e)!==0)return!1;try{return new i(e),!1}catch{return!0}}}),_=n.cw(e=>{var t=g(),n=TypeError;e.exports=function(e){if(t(e))throw new n(`ArrayBuffer is detached`);return e}}),v=n.cw(e=>{var t=m(),n=ie(),r=R(),i=Ie(),a=ze(),o=Te(),s=E(),c=en(),l=A(),u=M(),d=j(),f=mt(),p=pt(),h=vt(),g=dn(),_=tn(),v=Me(),y=v.enforce,b=v.get,x=r.Int8Array,S=x&&x.prototype,C=r.Uint8ClampedArray,w=C&&C.prototype,T=x&&p(x),D=S&&p(S),O=Object.prototype,k=r.TypeError,ee=g(`toStringTag`),te=_(`TYPED_ARRAY_TAG`),ne=`TypedArrayConstructor`,re=t&&!!h&&s(r.opera)!==`Opera`,ae=!1,N,oe,se,ce={Int8Array:1,Uint8Array:1,Uint8ClampedArray:1,Int16Array:2,Uint16Array:2,Int32Array:4,Uint32Array:4,Float32Array:4,Float64Array:8},le={BigInt64Array:8,BigUint64Array:8},ue=function(e){if(!a(e))return!1;var t=s(e);return t===`DataView`||o(ce,t)||o(le,t)},P=function(e){var t=p(e);if(a(t)){var n=b(t);return n&&o(n,ne)?n[ne]:P(t)}},F=function(e){if(!a(e))return!1;var t=s(e);return o(ce,t)||o(le,t)},de=function(e){if(F(e))return e;throw new k(`Target is not a typed array`)},fe=function(e){if(i(e)&&(!h||f(T,e)))return e;throw new k(c(e)+` is not a typed array constructor`)},pe=function(e,t,i,a){if(n){if(i)for(var s in ce){var c=r[s];if(c&&o(c.prototype,e))try{delete c.prototype[e]}catch{try{c.prototype[e]=t}catch{}}}(!D[e]||i)&&u(D,e,i?t:re&&S[e]||t,a)}},I=function(e,t,i){var a,s;if(n){if(h){if(i){for(a in ce)if(s=r[a],s&&o(s,e))try{delete s[e]}catch{}}if(!T[e]||i)try{return u(T,e,i?t:re&&T[e]||t)}catch{}else return}for(a in ce)s=r[a],s&&(!s[e]||i)&&u(s,e,t)}};for(N in ce)oe=r[N],se=oe&&oe.prototype,se?y(se)[ne]=oe:re=!1;for(N in le)oe=r[N],se=oe&&oe.prototype,se&&(y(se)[ne]=oe);if((!re||!i(T)||T===Function.prototype)&&(T=function(){throw new k(`Incorrect invocation`)},re))for(N in ce)r[N]&&h(r[N],T);if((!re||!D||D===O)&&(D=T.prototype,re))for(N in ce)r[N]&&h(r[N].prototype,D);if(re&&p(w)!==D&&h(w,D),n&&!o(D,ee))for(N in ae=!0,d(D,ee,{configurable:!0,get:function(){return a(this)?this[te]:void 0}}),ce)r[N]&&l(r[N].prototype,te,N);e.exports={NATIVE_ARRAY_BUFFER_VIEWS:re,TYPED_ARRAY_TAG:ae&&te,aTypedArray:de,aTypedArrayConstructor:fe,exportTypedArrayMethod:pe,exportTypedArrayStaticMethod:I,getTypedArrayConstructor:P,isView:ue,isTypedArray:F,TypedArray:T,TypedArrayPrototype:D}}),y=n.cw(e=>{var t=et();e.exports=function(e,n,r){for(var i=0,a=arguments.length>2?r:t(n),o=new e(a);a>i;)o[i]=n[i++];return o}}),b=n.cw(e=>{var t=Gt(),n=Ut(),r=et(),i=function(e){return function(i,a,o){var s=t(i),c=r(s);if(c===0)return!e&&-1;var l=n(o,c),u;if(e&&a!==a){for(;c>l;)if(u=s[l++],u!==u)return!0}else for(;c>l;l++)if((e||l in s)&&s[l]===a)return e||l||0;return!e&&-1}};e.exports={includes:i(!0),indexOf:i(!1)}}),x=n.cw(e=>{var t=ie(),n=Pe(),r=TypeError,i=Object.getOwnPropertyDescriptor;e.exports=t&&!function(){if(this!==void 0)return!0;try{Object.defineProperty([],"length",{writable:!1}).length=1}catch(e){return e instanceof TypeError}}()?function(e,t){if(n(e)&&!i(e,`length`).writable)throw new r(`Cannot set read only .length`);return e.length=t}:function(e,t){return e.length=t}}),S=n.cw(e=>{e.exports=L()([].slice)}),C=()=>n(804),w=n.cw(e=>{var t=f(),n=Je();e.exports=function(e,r,i,a){try{return a?r(t(i)[0],i[1]):r(i)}catch(t){n(e,`throw`,t)}}}),T=n.cw(e=>{var t=L(),n=t({}.toString),r=t(``.slice);e.exports=function(e){return r(n(e),8,-1)}}),E=n.cw(e=>{var t=Qt(),n=Ie(),r=T(),i=dn()(`toStringTag`),a=Object,o=r(function(){return arguments}())===`Arguments`,s=function(e,t){try{return e[t]}catch{}};e.exports=t?r:function(e){var t,c,l;return e===void 0?`Undefined`:e===null?`Null`:typeof(c=s(t=a(e),i))==`string`?c:o?r(t):(l=r(t))===`Object`&&n(t.callee)?`Arguments`:l}}),D=n.cw(e=>{var t=Te(),n=bt(),r=ut(),i=lt();e.exports=function(e,a,o){for(var s=n(a),c=i.f,l=r.f,u=0;u<s.length;u++){var d=s[u];!t(e,d)&&!(o&&t(o,d))&&c(e,d,l(a,d))}}}),O=n.cw(e=>{e.exports=!F()(function(){function e(){}return e.prototype.constructor=null,Object.getPrototypeOf(new e)!==e.prototype})}),k=()=>n(529),A=n.cw(e=>{var t'... 489936 more characters,
  expected: /function withResolvers\(/,
  operator: 'match',
  diff: 'simple'
}

Node.js v26.13.1
```

### node scripts/notices.mjs — exit 0

```text
Attribuzioni e licenze raccolte.
```

### npm run build — exit 0

```text

> cosmoffice@0.2.3 build
> node scripts/pdf-assets.mjs && node scripts/legal-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
Licenza e attribuzioni disponibili come file locali per l’anteprima.
vite v8.3.8 building client environment for production...
transforming...
✓ 2417 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               1.09 kB │ gzip:   0.53 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-Cmp-ZIhS.css               47.21 kB │ gzip:  10.82 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/DebugReport-DFYIwS3f.js           1.83 kB │ gzip:   0.87 kB
dist/assets/GuidedTest-BF6AjW4l.js            2.31 kB │ gzip:   1.05 kB
dist/assets/android-BuIAeMDG.js               2.41 kB │ gzip:   1.18 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-BZBx0KUz.js            11.03 kB │ gzip:   4.23 kB
dist/assets/SettingsPage-DZf3hTRd.js         24.69 kB │ gzip:   8.40 kB
dist/assets/MarkdownEditor-Bc92OywY.js       54.73 kB │ gzip:  16.85 kB
dist/assets/GridEditor-h7KgLGG3.js          203.80 kB │ gzip:  70.77 kB
dist/assets/import-docx-Ctf4domh.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-C2WGQL4F.js             2,324.24 kB │ gzip: 697.27 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.08s
```

### npm test — exit 0

```text

> cosmoffice@0.2.3 test
> node --test tests/*.test.mjs

✔ Compatibilità Android: Promise assente, risoluzione/rifiuto e sottoclassi (2.7914ms)
✔ Compatibilità Android: API esistente preservata, installazione idempotente (1.2686ms)
✔ Compatibilità Android: costruttori non validi rifiutati (2.1196ms)
✔ Ponte Android: byte binari e UTF-8 conservati, file vuoto e limite verificati (11.781ms)
✔ Android: nessun permesso Internet, storage esteso o installazione pacchetti (5.5553ms)
✔ Anteprima precedente: categorie diverse conservate, sola copia originale e foglio tecnico intatto (66.8327ms)
✔ Nuovi grafici: categorie da celle vere, nessun foglio nascosto, metadati v2 e riapertura (74.356ms)
✔ Export grafici: pagina orizzontale e adattamento alla larghezza senza mutare l’originale (123.2893ms)
✔ Grafici barre, linee e torta: dati vivi e parti native XLSX riaperte (187.7881ms)
✔ Grafici esterni senza metadati verificabili: blocco export e originale conservato (24.7489ms)
✔ Grafici e immagini condividono il disegno; titoli ed etichette XML sono escapati (44.1461ms)
✔ Formule, più serie, vuoti e rinomina foglio restano collegati ai grafici (35.5307ms)
✔ Disegno del grafico precede le tabelle secondo l’ordine OOXML (28.1803ms)
✔ Diagnostica: messaggi, nomi e percorsi arbitrari non entrano negli eventi (6.2475ms)
✔ Diagnostica: il contesto ammette solo valori controllati, nessun campo libero (1.0506ms)
Rapporto con 50 eventi e ultima traccia: 4931 byte UTF-8 (limite 6144).
✔ Registro locale: ultimi 50, persistenza sicura, riapertura e svuotamento (38.7716ms)
✔ Registro non scrivibile: memoria disponibile e svuotamento non dichiarato riuscito (4.9876ms)
✔ DOCX exports real text, bold marks and tables readable by another parser (106.9959ms)
✔ XLSX round trip retains sheets, styles, references and cells outside the UI viewport (86.8627ms)
✔ unknown formulas retain their source without exporting a misleading cached number (17.8227ms)
✔ CSV and TSV preserve quotes, multiline text, identifiers and decimal commas (4.463ms)
✔ cross-sheet formulas survive XLSX round trips and get calculated results (20.9545ms)
✔ DOCX retains fonts, colours, sizes, page format and margins in OOXML (12.8311ms)
✔ landscape DOCX uses a physically wider page with matching orientation (11.0813ms)
✔ Italian formulas are saved in invariant XLSX syntax without losing absolute references (11.8803ms)
✔ Il corpus contiene 5 DOCX, 5 XLSX e 3 PDF immutati (167.0429ms)
✔ references, arithmetic, precedence and percentages (4.2476ms)
✔ Italian aliases, absolute references, text and lazy IF (0.7556ms)
✔ cycles, division by zero and unknown functions are visible and propagated (0.6519ms)
✔ untrusted formulas cannot evaluate JavaScript, links or unlimited ranges (0.8038ms)
✔ Excel address limits and column naming (1.1902ms)
✔ conditional sums, lookups, text, dates and error handling (4.6928ms)
✔ quoted sheet names, absolute references and cycles across sheets (0.6682ms)
✔ Italian decimal commas and separators coexist with invariant XLSX formula syntax (0.5153ms)
✔ literal text resembling errors stays text while actual formula errors propagate (0.9816ms)
✔ empty strings, blank cells and boolean predicates retain their separate types (0.747ms)
✔ Prova guidata: otto sole scelte controllate, nessun campo o valore libero (2.3442ms)
✔ Markdown UTF-8 conserva BOM, CRLF, accenti e sintassi non interpretata (2.0892ms)
✔ Markdown rifiuta UTF-8 invalido senza sostituire caratteri (0.7368ms)
✔ Il processo principale carica l’interfaccia locale e non usa API di rete dirette (8.3697ms)
✔ Le API Node ed Electron sono bloccate prima di poter aprire connessioni (240.9727ms)
✔ Rotazione PDF conserva pagine e flussi originali: 01-testo.pdf (51.0491ms)
✔ Rotazione PDF conserva pagine e flussi originali: 02-scansione.pdf (10.9555ms)
✔ Rotazione PDF conserva pagine e flussi originali: 03-venti-pagine.pdf (112.1418ms)
✔ Rotazione rifiuta pagina inesistente, dati corrotti e marcatori di firma senza cambiare il sorgente (20.4815ms)
✔ Release corrente: note complete per la versione realmente distribuita (9.128ms)
✔ Mac: anteprima senza identità, firma forzata o notarizzazione (3.4099ms)
✔ Release: completa Linux preservando Windows e rifiuta AppImage con nome inatteso (57.8115ms)
✔ Release: note dal CHANGELOG e piattaforma mancante dichiarata, senza prerelease (0.689ms)
✔ Release: hash reali e pubblicazione soltanto dopo upload, nessun certificato necessario (41.8578ms)
✔ Excel exports do not mutate the open workbook, even when exported concurrently (133.4505ms)
✔ shared formulas, dates, merges, links and embedded images survive the Excel working copy (40.5762ms)
✔ damaged files and mismatched Office extensions are rejected before import (10.1909ms)
✔ unsupported parts produce specific warnings without changing the original file (36.5819ms)
✔ identifiers retain leading zeroes and all digits through typing, paste and XLSX export (17.6063ms)
✔ XLSX caches keep literal error-like strings separate from actual error cells (13.5422ms)
✔ Italiano incluso: forme flesse, accenti, elisioni ed errori distinti (886.9469ms)
✔ Dizionario personale separato, validato e rimuovibile senza alterare il lessico (1855.108ms)
✔ TLS Node spento o URL iniziale estraneo: nessun worker, nessuna connessione (2.7357ms)
✔ TLS Node: certificato obbligatorio, intestazioni minime e CDN del solo repository (3.645ms)
✔ TLS Node: redirect ad altro host, HTTP o repository CDN bloccato prima del contatto (1.8993ms)
✔ TLS Node: errore di certificato senza fallback (0.6346ms)
✔ TLS Node: limite dei byte, originale preesistente preservato e parziale rimosso (17.9954ms)
✔ TLS Node: disattivazione termina il worker e pulisce il temporaneo posseduto (3.3157ms)
✔ Profilo nuovo e vecchia preferenza attivo: nessuna richiesta all’avvio e default spento (134.9866ms)
✔ Un clic manuale, duplicati accorpati, rete spenta al termine senza abilitare i periodici (3.3316ms)
✔ Annullamento durante il controllo: risposta tardiva ignorata e trasporto chiuso (1.875ms)
✔ Periodici soltanto dopo consenso esplicito: abilitare non esegue un controllo immediato (150.5208ms)
✔ Aggiornamenti: URL limitati al repository, rifiuto di credenziali, altri host e percorsi (2.1447ms)
✔ Aggiornamenti: elenco SHA-256 rigoroso e confronto semantico delle versioni (1.2273ms)
✔ Mac: notifica senza download del DMG; preferenza disattivata senza richieste (15.2146ms)
✔ Windows: download verificato, installer alterato respinto prima dell’esecuzione (22.9463ms)
✔ SHA errato: nessun installer pronto, nessun temporaneo e nessuna esecuzione (5.3243ms)
✔ Disattivazione durante il controllo: risposta tardiva ignorata, nessun download (5.5357ms)
✔ AppImage: sostituzione verificata; un documento con estensione AppImage rimane intatto (24.1097ms)
✔ Installer Windows: interattivo dopo consenso, nessuna shell né opzione silenziosa (0.9197ms)
✔ AppImage: solo la propria APPDIR, mai APPIMAGE ereditata da un altro programma (31.9725ms)
✔ Disattivazione senza disco scrivibile: rete spenta subito e avviso di mancato salvataggio (6.356ms)
ℹ tests 78
ℹ suites 0
ℹ pass 78
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3202.4843
```

### npm run test:browser — exit 0

```text

> cosmoffice@0.2.3 test:browser
> node scripts/smoke.mjs && node scripts/preferences-smoke.mjs && node scripts/reliability-smoke.mjs && node scripts/corpus-smoke.mjs && node scripts/spelling-smoke.mjs && node scripts/charts-smoke.mjs && node scripts/guided-browser.mjs && node scripts/about-browser.mjs && node scripts/markdown-smoke.mjs && node scripts/android-browser-smoke.mjs

{
  "result": "PASS",
  "scenarios": [
    "DOCX import/modifica/export",
    "Ripristino bozza dopo riavvio",
    "XLSX import/formule/modifica/export",
    "Fogli multipli",
    "PDF rendering/navigazione/ricerca/copia identica",
    "Layout 390px",
    "Zero richieste esterne"
  ],
  "errors": [],
  "external": []
}
{
  "result": "PASS",
  "scenarios": [
    "Incolla intervalli, annulla/ripristina",
    "Rinomina e duplica fogli",
    "Tema/colore/scala/densità/barra laterale applicati",
    "Font/margini/ortografia applicati",
    "Trova e sostituisci",
    "Preferenze persistenti",
    "Backup e ripristino senza sovrascrittura",
    "Conferma svuotamento archivio",
    "Impostazioni a 390px"
  ],
  "errors": []
}
07:51:49 [vite] (client) [console.warn] Warning: Indexing all PDF objects
{
  "result": "PASS",
  "scenarios": [
    "Errore quota: documento conservato e navigazione bloccata",
    "Riprova salvataggio e recupero dopo riavvio",
    "DOCX/PDF danneggiati e estensioni errate respinti senza creare bozze",
    "Avviso specifico per commenti Word",
    "Ripristino archivio atomico anche in caso di dati non scrivibili"
  ],
  "errors": []
}
PASS 01-testo-stili.docx
PASS 02-tabella.docx
PASS 03-immagine.docx
PASS 04-elenchi.docx
PASS 05-intestazioni.docx
PASS 01-formule.xlsx
PASS 02-piu-fogli.xlsx
PASS 03-formati.xlsx
PASS 04-unioni-immagine.xlsx
PASS 05-dati-filtro.xlsx
PASS 01-testo.pdf
PASS 02-scansione.pdf
PASS 03-venti-pagine.pdf
PASS ortografia italiana: Write, Grid, impostazioni, parole personali, riavvio pagina e nessuna richiesta esterna.
PASS grafici: categorie nelle celle, nuovi XLSX senza fogli nascosti, dati aggiornati e file riaperti; vecchia anteprima in sola lettura con copia identica; grafici esterni con export bloccato; nessuna richiesta esterna.
PASS prova guidata nel browser: 24 radio, rapporto aggiornato e schermata acquisita.
PASS Informazioni browser: versione 0.2.3, testi uguali ai file locali, attribuzioni, migrazione vecchio attivo e nessuna richiesta esterna.
PASS Markdown browser: creazione, apertura UTF-8/BOM/CRLF, modifica, export identico, riapertura dopo ricarica, backup, vuoto, HTML ostile, file grande, 390px, nessuna rete esterna.
07:53:46 [vite] (client) [Unhandled error] TypeError: CONTENUTO_PRIVATO_ANDROID

PASS frontend Android con ponte simulato: bytes, apertura DOCX, Markdown, ritorno alle bozze, tema sistema, impostazioni offline, rapporto sicuro persistente e copia. Questa prova NON è il collaudo dell’APK.
```

### npm run test:openxml — exit 0

```text

> cosmoffice@0.2.3 test:openxml
> node scripts/validate-openxml.mjs

  Individuazione dei progetti da ripristinare...
  <progetto>\scripts\openxml-validator\OpenXmlCheck.csproj ripristinato (in 560 ms).
  OpenXmlCheck -> <progetto>\scripts\openxml-validator\bin\Release\net10.0\OpenXmlCheck.dll

Compilazione completata.
    Avvisi: 0
    Errori: 0

Tempo trascorso 00:00:03.21
PASS <progetto>\test-results\corpus\01-testo-stili.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\02-tabella.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\03-immagine.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\04-elenchi.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\05-intestazioni.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\01-formule.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\02-piu-fogli.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\03-formati.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\04-unioni-immagine.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\corpus\05-dati-filtro.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\openxml\smoke.docx: 0 errori Open XML SDK
PASS <progetto>\test-results\openxml\smoke.xlsx: 0 errori Open XML SDK
PASS <progetto>\test-results\grafici-ui.xlsx: 0 errori Open XML SDK
FAIL <progetto>\test-results\openxml\negative\schema-errato.docx: 1 errori Open XML SDK
{"id":"Sch_InvalidElementContentExpectingComplex","description":"The element has invalid child element \u0027http://schemas.openxmlformats.org/wordprocessingml/2006/main:cosmoInvalido\u0027.","part":"/word/document.xml","path":"/w:document[1]/w:body[1]"}
FAIL <progetto>\test-results\openxml\negative\schema-errato.xlsx: 1 errori Open XML SDK
{"id":"Sch_AttributeValueDataTypeDetailed","description":"The attribute \u0027orientation\u0027 has invalid value \u0027diagonale\u0027. The Enumeration constraint failed.","part":"/xl/worksheets/sheet1.xml","path":"/x:worksheet[1]/x:pageSetup[1]"}
PASS Open XML SDK: 13 esportati validi e invariati; DOCX e XLSX volutamente errati respinti con codice 1.
FAIL <progetto>\test-results\openxml\legacy-copy.xlsx: apertura non riuscita: The document cannot be opened because there is an invalid part with an unexpected content type.
[Part Uri=/xl/drawings/cosmoDrawing1.xml],
[Content Type=application/vnd.openxmlformats-officedocument.drawingml.drawing+xml],
[Expected Content Type=application/vnd.openxmlformats-officedocument.drawing+xml].
ECCEZIONE STORICA VERIFICATA: copia v1 identica, errore MIME del disegno conservato e segnalato nel report separato. Nessuna eccezione per i nuovi esportati.
```

### node scripts/debug-smoke.mjs — exit 0

```text
PASS rapporto tester: errori renderer/promise/main, privacy, menu e impostazioni, clipboard reale, persistenza e svuotamento.
```

### node scripts/guided-smoke.mjs — exit 0

```text
PASS prova guidata: 8 prove, 24 radio, nessun campo libero, esiti persistenti, otto righe iniziali, clipboard reale, valori arbitrari esclusi e nessuna rete.
```

### node scripts/legal-smoke.mjs --package — exit 0

```text
PASS Informazioni pacchetto: file locali identici, attribuzioni, percorso arbitrario respinto e zero richieste Node.
```

### node scripts/package-resources-check.mjs — exit 0

```text
{
  "result": "PASS",
  "checked": [
    {
      "package": "CosmOffice-0.2.3-win-x64-Setup.exe",
      "version": "0.2.3",
      "hashes": {
        "LICENSE": "f2649c4c63c51b60799de533efbc3c09a71639df963f677492bbe5e865f9006f",
        "THIRD_PARTY_NOTICES.txt": "d743f96b9aeb6e6281f4d4bad5bc8787c3c275787cdc7e34467ba5fbece19678"
      },
      "resources": "LICENSE e THIRD_PARTY_NOTICES.txt identici ai sorgenti",
      "asarLicense": true
    }
  ],
  "installed": false
}
```

### node test-results/android/yaml-check.mjs — exit 0

```text
PASS YAML: android.yml
PASS YAML: build.yml
PASS YAML: release-linux.yml
PASS YAML: release-mac.yml
PASS YAML: release.yml
```

### node --check scripts/android-smoke.mjs — exit 0

```text

```

### node scripts/update-network-smoke.mjs — exit 0

```text
{
  "result": "PASS",
  "package": false,
  "reports": [
    {
      "legacy": false,
      "result": "PASS",
      "startupNodeRequests": 0,
      "chromiumConnections": 0,
      "chromiumRequests": 0,
      "manual": true,
      "cancelled": true,
      "networkOffAfterwards": true,
      "downloaded": {
        "name": "CosmOffice-0.2.3-win-x64-Setup.exe",
        "size": 128054418,
        "sha256": "0eef1275a813b0fe0ebee6e141deebc101aab410f855c46e1c2280462111fd18",
        "integrity": true,
        "installed": false
      },
      "nodeAudit": [
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "github.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "blocked",
          "host": "example.invalid"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "github.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        }
      ]
    },
    {
      "legacy": true,
      "result": "PASS",
      "startupNodeRequests": 0,
      "chromiumConnections": 0,
      "chromiumRequests": 0,
      "manual": false,
      "cancelled": false,
      "networkOffAfterwards": true,
      "downloaded": null,
      "nodeAudit": []
    }
  ]
}
```

### node scripts/offline-smoke.mjs — exit 0

```text
{
  "result": "PASS",
  "checks": [
    "Avvio Electron da file locale",
    "Nessun tentativo spontaneo di rete dal processo principale",
    "Controllo aggiornamenti spento: zero richieste nell’audit Node",
    "DOCX, XLSX e PDF aperti senza connessioni",
    "Richiesta intenzionale dal main rilevata e bloccata prima della connessione",
    "NetLog Chromium: nessuna connessione TCP, UDP, QUIC o transazione DNS"
  ],
  "errors": []
}
```

### node scripts/update-network-smoke.mjs --package — exit 0

```text
{
  "result": "PASS",
  "package": true,
  "reports": [
    {
      "legacy": false,
      "result": "PASS",
      "startupNodeRequests": 0,
      "chromiumConnections": 0,
      "chromiumRequests": 0,
      "manual": true,
      "cancelled": true,
      "networkOffAfterwards": true,
      "downloaded": {
        "name": "CosmOffice-0.2.3-win-x64-Setup.exe",
        "size": 128054418,
        "sha256": "0eef1275a813b0fe0ebee6e141deebc101aab410f855c46e1c2280462111fd18",
        "integrity": true,
        "installed": false
      },
      "nodeAudit": [
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "github.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "blocked",
          "host": "example.invalid"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "github.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "github.com"
        },
        {
          "phase": "lookup",
          "host": "github.com"
        },
        {
          "phase": "redirect",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "request",
          "host": "release-assets.githubusercontent.com"
        },
        {
          "phase": "lookup",
          "host": "release-assets.githubusercontent.com"
        }
      ]
    },
    {
      "legacy": true,
      "result": "PASS",
      "startupNodeRequests": 0,
      "chromiumConnections": 0,
      "chromiumRequests": 0,
      "manual": false,
      "cancelled": false,
      "networkOffAfterwards": true,
      "downloaded": null,
      "nodeAudit": []
    }
  ]
}
```

### node scripts/desktop-smoke.mjs — exit 0

```text
{
  "result": "PASS",
  "package": "Windows x64",
  "checks": [
    "Avvio pacchetto locale",
    "Preload isolato e nessun require nel renderer",
    "Apertura DOCX/XLSX/PDF via IPC e filesystem",
    "Esportazione documento in PDF tramite printToPDF",
    "Worker PDF da file locale",
    "Esportazione PDF identica su disco",
    "Rotazione di pagina 2 salvata su disco e riaperta nel pacchetto",
    "Poppler indipendente: prima pagina a 0°, seconda a 90°",
    "Nessun tentativo di rete nel main del pacchetto",
    "Errore di scrittura: originale preservato e temporanei rimossi",
    "Pagina impostazioni e tema scuro nel pacchetto",
    "Chiusura dopo notifica simulata di arresto del renderer"
  ],
  "errors": []
}
```

### node scripts/update-confirm-smoke.mjs — exit 0

```text
PASS consenso nel pacchetto Windows: Annulla non installa; chiusura normale non installa; conferma esplicita salva e chiude, ricontrolla SHA-256 e avvia solo lo spy interattivo. Nessun installer eseguito.
```

### Build desktop e asset Android — exit 0

```text

> cosmoffice@0.2.3 android:prepare
> npm run build && node scripts/android-prepare.mjs


> cosmoffice@0.2.3 build
> node scripts/pdf-assets.mjs && node scripts/legal-assets.mjs && vite build

Font, mappe caratteri e decoder PDF disponibili offline.
Licenza e attribuzioni disponibili come file locali per l’anteprima.
vite v8.3.8 building client environment for production...
transforming...
✓ 2417 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               1.09 kB │ gzip:   0.53 kB
dist/assets/pdf.worker.min-CIqJB0yW.mjs   1,271.91 kB
dist/assets/index-Cmp-ZIhS.css               47.21 kB │ gzip:  10.82 kB
dist/assets/rolldown-runtime-COiEfhsA.js      1.11 kB │ gzip:   0.62 kB
dist/assets/DebugReport-DFYIwS3f.js           1.83 kB │ gzip:   0.87 kB
dist/assets/GuidedTest-BF6AjW4l.js            2.31 kB │ gzip:   1.05 kB
dist/assets/android-BuIAeMDG.js               2.41 kB │ gzip:   1.18 kB
dist/assets/jsx-runtime-CldxteV5.js           8.24 kB │ gzip:   3.11 kB
dist/assets/PdfViewer-BZBx0KUz.js            11.03 kB │ gzip:   4.23 kB
dist/assets/SettingsPage-DZf3hTRd.js         24.69 kB │ gzip:   8.40 kB
dist/assets/MarkdownEditor-Bc92OywY.js       54.73 kB │ gzip:  16.85 kB
dist/assets/GridEditor-h7KgLGG3.js          203.80 kB │ gzip:  70.77 kB
dist/assets/import-docx-Ctf4domh.js         301.70 kB │ gzip:  89.24 kB
dist/assets/pdf-editing-D-QQ0kUb.js         420.76 kB │ gzip: 175.99 kB
dist/assets/pdf-engine-BF-5vh4s.js          443.65 kB │ gzip: 133.60 kB
dist/assets/index-C2WGQL4F.js             2,324.24 kB │ gzip: 697.27 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.14s
vite v8.3.8 building client environment for production...
transforming...
✓ 2417 modules transformed.
rendering chunks...
computing gzip size...
test-results/android/web/index.html                                 1.09 kB │ gzip:   0.53 kB
test-results/android/web/assets/pdf.worker.compat-DwCflaMd.mjs  1,328.46 kB
test-results/android/web/assets/index-Cmp-ZIhS.css                 47.21 kB │ gzip:  10.82 kB
test-results/android/web/assets/rolldown-runtime-BIxSLxaa.js        1.52 kB │ gzip:   0.81 kB
test-results/android/web/assets/DebugReport-iQEoGYck.js             2.24 kB │ gzip:   1.08 kB
test-results/android/web/assets/GuidedTest-BgVr3-ep.js              2.71 kB │ gzip:   1.26 kB
test-results/android/web/assets/android-DaHDPtua.js                 2.81 kB │ gzip:   1.37 kB
test-results/android/web/assets/jsx-runtime-CMtwxTc-.js             8.65 kB │ gzip:   3.29 kB
test-results/android/web/assets/PdfViewer-MZXYHzCm.js              11.44 kB │ gzip:   4.41 kB
test-results/android/web/assets/SettingsPage-BWDuXitN.js           25.10 kB │ gzip:   8.58 kB
test-results/android/web/assets/MarkdownEditor-V7Oaof6S.js         55.14 kB │ gzip:  17.06 kB
test-results/android/web/assets/GridEditor-BBCV5-lH.js            204.21 kB │ gzip:  70.95 kB
test-results/android/web/assets/import-docx-BMsy2RTp.js           302.11 kB │ gzip:  89.42 kB
test-results/android/web/assets/pdf-editing-D6SlWrek.js           421.17 kB │ gzip: 176.15 kB
test-results/android/web/assets/pdf-engine-DXHvtvMa.js            499.95 kB │ gzip: 152.80 kB
test-results/android/web/assets/index-BahDu6sK.js               2,324.65 kB │ gzip: 697.46 kB

[plugin builtin:vite-reporter]
(!) Some chunks are larger than 1900 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 1.12s
Asset Android pronti: editor, worker/font PDF, dizionario italiano, licenze e icona Cosmonet locali. Tre campioni originali e Markdown per il solo APK di test.
```

### Gradle APK debug/test/release e lint — exit 0

```text
To honour the JVM settings for this build a single-use Daemon process will be forked. For more on this, please refer to https://docs.gradle.org/8.13/userguide/gradle_daemon.html#sec:disabling_the_daemon in the Gradle documentation.
Daemon will be stopped at the end of the build
Checking the license for package Android SDK Platform-Tools in <progetto>\test-results\android\tools\sdk\licenses
Warning: License for package Android SDK Platform-Tools not accepted.
WARNING: platform-tools package is not installed. Please accept the installation licence to continue
> Task :app:clean
> Task :app:preBuild UP-TO-DATE
> Task :app:preDebugBuild UP-TO-DATE
> Task :app:mergeDebugNativeDebugMetadata NO-SOURCE
> Task :app:generateDebugBuildConfig
> Task :app:javaPreCompileDebug
> Task :app:checkDebugAarMetadata
> Task :app:processDebugNavigationResources
> Task :app:generateDebugResValues
> Task :app:compileDebugNavigationResources
> Task :app:mapDebugSourceSetPaths
> Task :app:generateDebugResources
> Task :app:packageDebugResources
> Task :app:createDebugCompatibleScreenManifests
> Task :app:extractDeepLinksDebug
> Task :app:mergeDebugResources
> Task :app:parseDebugLocalResources
> Task :app:processDebugMainManifest
> Task :app:processDebugManifest
> Task :app:mergeDebugShaders
> Task :app:compileDebugShaders NO-SOURCE
> Task :app:generateDebugAssets UP-TO-DATE
> Task :app:mergeDebugAssets
> Task :app:desugarDebugFileDependencies
> Task :app:processDebugJavaRes NO-SOURCE
> Task :app:checkDebugDuplicateClasses
> Task :app:mergeDebugJniLibFolders
> Task :app:mergeDebugNativeLibs NO-SOURCE
> Task :app:stripDebugDebugSymbols NO-SOURCE
> Task :app:mergeExtDexDebug
> Task :app:mergeLibDexDebug
> Task :app:compressDebugAssets
> Task :app:mergeDebugJavaResource
> Task :app:validateSigningDebug
> Task :app:writeDebugAppMetadata
> Task :app:writeDebugSigningConfigVersions
> Task :app:preDebugAndroidTestBuild SKIPPED
> Task :app:processDebugAndroidTestManifest
> Task :app:generateDebugAndroidTestBuildConfig
> Task :app:javaPreCompileDebugAndroidTest
> Task :app:checkDebugAndroidTestAarMetadata
> Task :app:processDebugAndroidTestNavigationResources
> Task :app:compileDebugAndroidTestNavigationResources
> Task :app:generateDebugAndroidTestResValues
> Task :app:mapDebugAndroidTestSourceSetPaths
> Task :app:generateDebugAndroidTestResources
> Task :app:mergeDebugAndroidTestResources
> Task :app:mergeDebugAndroidTestShaders
> Task :app:compileDebugAndroidTestShaders NO-SOURCE
> Task :app:generateDebugAndroidTestAssets UP-TO-DATE
> Task :app:mergeDebugAndroidTestAssets
> Task :app:desugarDebugAndroidTestFileDependencies
> Task :app:processDebugAndroidTestJavaRes NO-SOURCE
> Task :app:checkDebugAndroidTestDuplicateClasses
> Task :app:mergeDebugAndroidTestJavaResource
> Task :app:compressDebugAndroidTestAssets
> Task :app:mergeDebugAndroidTestJniLibFolders
> Task :app:mergeExtDexDebugAndroidTest
> Task :app:mergeDebugAndroidTestNativeLibs NO-SOURCE
> Task :app:stripDebugAndroidTestDebugSymbols NO-SOURCE
> Task :app:mergeLibDexDebugAndroidTest
> Task :app:validateSigningDebugAndroidTest
> Task :app:writeDebugAndroidTestSigningConfigVersions
> Task :app:preReleaseBuild UP-TO-DATE
> Task :app:mergeReleaseJniLibFolders
> Task :app:mergeReleaseNativeLibs NO-SOURCE
> Task :app:stripReleaseDebugSymbols NO-SOURCE
> Task :app:extractReleaseNativeSymbolTables NO-SOURCE
> Task :app:mergeReleaseNativeDebugMetadata NO-SOURCE
> Task :app:checkReleaseDuplicateClasses
> Task :app:generateReleaseBuildConfig
> Task :app:javaPreCompileRelease
> Task :app:checkReleaseAarMetadata
> Task :app:processReleaseNavigationResources
> Task :app:compileReleaseNavigationResources
> Task :app:generateReleaseResValues
> Task :app:mapReleaseSourceSetPaths
> Task :app:generateReleaseResources
> Task :app:packageReleaseResources
> Task :app:createReleaseCompatibleScreenManifests
> Task :app:extractDeepLinksRelease
> Task :app:parseReleaseLocalResources
> Task :app:processReleaseMainManifest
> Task :app:processReleaseManifest
> Task :app:mergeReleaseResources
> Task :app:desugarReleaseFileDependencies
> Task :app:mergeReleaseStartupProfile UP-TO-DATE
> Task :app:mergeExtDexRelease
> Task :app:processReleaseManifestForPackage
> Task :app:mergeReleaseArtProfile UP-TO-DATE
> Task :app:mergeReleaseShaders
> Task :app:compileReleaseShaders NO-SOURCE
> Task :app:generateReleaseAssets UP-TO-DATE
> Task :app:processDebugAndroidTestResources
> Task :app:processReleaseResources
> Task :app:mergeReleaseAssets

> Task :app:compileReleaseJavaWithJavac

> Task :app:dexBuilderRelease
> Task :app:mergeReleaseGlobalSynthetics
> Task :app:extractReleaseVersionControlInfo
> Task :app:extractProguardFiles
> Task :app:generateReleaseLintVitalReportModel
> Task :app:processReleaseJavaRes NO-SOURCE
> Task :app:mergeReleaseJavaResource
> Task :app:processDebugManifestForPackage
> Task :app:mergeDexRelease
> Task :app:collectReleaseDependencies
> Task :app:compileReleaseArtProfile
> Task :app:sdkReleaseDependencyData
> Task :app:writeReleaseAppMetadata
> Task :app:writeReleaseSigningConfigVersions
> Task :app:preDebugUnitTestBuild UP-TO-DATE
> Task :app:optimizeReleaseResources
> Task :app:processDebugResources
> Task :app:compressReleaseAssets

> Task :app:compileDebugJavaWithJavac

> Task :app:dexBuilderDebug
> Task :app:mergeDebugGlobalSynthetics
> Task :app:generateDebugLintReportModel
> Task :app:mergeProjectDexDebug
> Task :app:bundleDebugClassesToCompileJar
> Task :app:compileDebugAndroidTestJavaWithJavac
> Task :app:dexBuilderDebugAndroidTest
> Task :app:mergeDebugAndroidTestGlobalSynthetics
> Task :app:generateDebugAndroidTestLintModel
> Task :app:mergeProjectDexDebugAndroidTest
> Task :app:generateDebugUnitTestLintModel
> Task :app:packageDebug
> Task :app:createDebugApkListingFileRedirect
> Task :app:assembleDebug
> Task :app:packageDebugAndroidTest
> Task :app:createDebugAndroidTestApkListingFileRedirect
> Task :app:assembleDebugAndroidTest
> Task :app:lintAnalyzeDebugUnitTest
> Task :app:lintAnalyzeDebugAndroidTest
> Task :app:lintVitalAnalyzeRelease
> Task :app:lintVitalReportRelease
> Task :app:lintVitalRelease
> Task :app:lintAnalyzeDebug
> Task :app:packageRelease
> Task :app:createReleaseApkListingFileRedirect
> Task :app:assembleRelease

> Task :app:lintReportDebug
Wrote HTML report to file:///<progetto>/android/app/build/reports/lint-results-debug.html

> Task :app:lintDebug

[Incubating] Problems report is available at: file:///<progetto>/android/build/reports/problems/problems-report.html

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.13/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 23s
118 actionable tasks: 116 executed, 2 up-to-date
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
Note: <progetto>\android\app\src\main\java\it\cosmonet\cosmoffice\MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
```

### Controllo APK corretto — exit 0

```text
{
  "result": "PASS",
  "version": "0.2.3",
  "androidVersionCode": 2,
  "minAndroid": 10,
  "permissions": [],
  "legalFilesIdentical": true,
  "localDictionary": true,
  "localPdfWorker": true,
  "compatiblePdfApiAndWorker": true,
  "promiseCompatibilityInPageAndWorker": true,
  "privateKeyInApk": false,
  "signed": false,
  "installable": false
}
```

### Firma APK — exit 0

```text
{
  "result": "PASS",
  "version": "0.2.3",
  "signed": true,
  "certificateSha256": "32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e",
  "apkSha256": "2f72a4747e7c1bc0a5860b2916db720719b4c4ec7e01da0406e15dc0867b964f",
  "unsignedSha256": "4202a4cd124d231d284ed6c149739af0e092af11de22c9c41d3dd86489eac8bb",
  "privateKeyUploaded": false,
  "physicalDeviceTested": false
}
APK firmato: CosmOffice-0.2.3-android-4202a4cd124d.apk
```

### Metadati aggiornamento e copia di consegna — exit 0

```text
{
  "result": "PASS",
  "file": "CosmOffice-0.2.3-Android-2.apk",
  "sha256": "2f72a4747e7c1bc0a5860b2916db720719b4c4ec7e01da0406e15dc0867b964f",
  "old": {
    "appId": "it.cosmonet.cosmoffice",
    "versionCode": 1,
    "certificateSha256": "32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e"
  },
  "updated": {
    "appId": "it.cosmonet.cosmoffice",
    "versionCode": 2,
    "certificateSha256": "32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e"
  },
  "sameCertificateAndPackage": true,
  "physicalUpgradeTested": false
}
```

## 4. Cosa funziona (provato)

Nuovo supporto Promise nei test unitari e nei veri worker browser. Tre PDF senza API aprono, renderizzano, ruotano, salvano e riaprono; 90° verificati nei file. Vecchio APK fallisce con lo stesso errore della foto. Tutti 16 controlli locali exit 0, 78 unitari, build/browser/Open XML/offline/desktop/aggiornamenti/pacchetto/YAML verdi. APK compilato/lint passato, code 2, zero permessi, supporto presente prima del motore. Stessa firma e package verificati nel vecchio e nel nuovo APK.

Nuovo APK 0.2.3 build 2 SHA-256 **2f72a4747e7c1bc0a5860b2916db720719b4c4ec7e01da0406e15dc0867b964f**. Certificato pubblico SHA-256 **32e3b39b807a391a018c2183eee609ccf8c28c92b7243b12418c23f93351804e**. Chiave/password sempre fuori Git, nessuna nuova chiave generata o caricata. Preparato come aggiornamento, non come nuova app separata.

## 5. Cosa NON funziona o non hai potuto provare

Il primo APK è difettoso sul telefono del titolare per i PDF: non nascondere questo esito dietro gli otto casi emulatori passati. La build 2 non è ancora provata su quello stesso telefono né con il suo documento; modello/versione WebView non noti. Aggiornamento reale con bozze esistenti non provato: firma/package/codice corretti sono prerequisiti verificati, non prova di conservazione effettiva. Non è richiesta la disinstallazione per il nuovo APK.

La nuova esecuzione nativa sull’emulatore è ancora da osservare dopo il push; non si spaccia il browser con porta simulata per APK. Restano AND-014 (catture con frame precedenti), tastiera software/gesti, prestazioni, altri WebView/dispositivi, provider cloud e crash fisici non collaudati. Limite file 10 MB, stampa e Word→PDF solo desktop, iOS assente. Nessuna Release/tag Android, nessun pacchetto pubblico desktop sostituito.

## 6. Bug e dubbi

AND-015 causa riprodotta e correzione locale verificata, ma non chiuso sul telefono prima della prova del titolare. Non è corretto dichiarare tutti i PDF o tutti gli Android compatibili sulla base di tre campioni. I fallimenti precedenti (regressione intenzionale, controllo APK troppo legato al nome minificato) sono riportati sopra; nessun test indebolito per ottenere verde. Warning SDK Platform-Tools/licenza, deprecazioni Java/Gradle e chunk grandi conservati nei log. Nessuna nuova libreria, motore o idea dello studio.

Fonti: screenshot privato del titolare (non pubblicato), asset del vecchio APK, moduli/metadati PDF.js 6.5.438 già citati in CODICE-STUDIATO.md e comportamento verificato con VM/browser. Nessun codice esterno copiato per il supporto Promise.

## 7. Hash del commit

Base 672e0a403c11df62a51209b499c1e6cfc22c7e4c. Precedente collaudo Android 770596758c41a8cffefc4fe5f33b5f27d8cede93. Hash del nuovo fix dopo il commit: git log -1 --format=%H -- docs/report/2026-11-28_0758_android-pdf-promise.md. Il nuovo hash e la CI sono da leggere dopo il push; nessuna dichiarazione anticipata di verde.

## 8. Prossimo passo

Osservare CI nativa e desktop del nuovo commit; consegnare il file build 2 come aggiornamento dell’APK attuale, verificare sul telefono lo stesso PDF e la permanenza delle bozze. Non chiedere disinstallazione per aggirare un errore di aggiornamento. Se emergono altre API mancanti, registrare il messaggio tecnico senza documenti personali, riprodurre e correggere con regressione mirata. Nessun tag/Release o cambio del motore.
