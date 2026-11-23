const release = process.env.COSMO_PUBLISH_UPDATES === '1';
module.exports = {
  appId: 'it.cosmonet.cosmoffice',
  productName: 'CosmOffice',
  copyright: 'Copyright © 2026 Daniele Spalletti',
  directories: { output: 'release', buildResources: 'build' },
  files: ['dist/**/*', '!dist/legal/**/*', 'electron/**/*', 'public/brand/suite.png', 'package.json', 'LICENSE'],
  extraResources: [{ from: 'public/legal/LICENSE', to: 'LICENSE' }, { from: 'THIRD_PARTY_NOTICES.txt', to: 'THIRD_PARTY_NOTICES.txt' }],
  asar: true,
  npmRebuild: false,
  forceCodeSigning: release && process.platform !== 'linux',
  artifactName: '${productName}-${version}-${os}-${arch}.${ext}',
  publish: release ? [{ provider: 'github', owner: 'CosmoNetinfo', repo: 'CosmOffice', releaseType: 'draft' }] : null,
  win: { target: ['nsis', 'portable'], icon: 'build/icon.ico', ...(process.env.WIN_PUBLISHER_NAME ? { signtoolOptions: { publisherName: process.env.WIN_PUBLISHER_NAME } } : {}) },
  nsis: { artifactName: '${productName}-${version}-${os}-${arch}-Setup.${ext}', oneClick: false, allowToChangeInstallationDirectory: true, createDesktopShortcut: true, shortcutName: 'CosmOffice', installerLanguages: ['it_IT', 'en_US'], language: '1040' },
  portable: { artifactName: '${productName}-${version}-${os}-${arch}-Portable.${ext}' },
  mac: { target: ['dmg', 'zip'], icon: 'build/icon.png', category: 'public.app-category.productivity', ...(release ? {} : { identity: null }), hardenedRuntime: release, notarize: release },
  linux: { target: ['AppImage', 'deb'], icon: 'build/icon.png', category: 'Office', maintainer: 'Cosmonet' },
};
