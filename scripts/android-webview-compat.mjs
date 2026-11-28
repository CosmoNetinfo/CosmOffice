// Original CosmOffice compatibility code. Used only by the Android build,
// before PDF.js in both page chunks and the separate module worker.
(() => {
  'use strict';
  if (typeof Promise.withResolvers === 'function') return;
  Object.defineProperty(Promise, 'withResolvers', {
    configurable: true, writable: true, enumerable: false,
    value: function withResolvers() {
      const Constructor = this;
      let resolve, reject;
      const promise = new Constructor((onResolve, onReject) => {
        if (resolve !== undefined || reject !== undefined) throw new TypeError('Esecutore Promise già inizializzato.');
        resolve = onResolve; reject = onReject;
      });
      if (typeof resolve !== 'function' || typeof reject !== 'function') throw new TypeError('Costruttore Promise non valido.');
      return { promise, resolve, reject };
    },
  });
})();
