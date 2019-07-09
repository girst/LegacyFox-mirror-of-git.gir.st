// keep this comment
try {
  let Xdb = Cu.import('resource://gre/modules/addons/XPIDatabase.jsm', {});
  Xdb.XPIDatabase['SIGNED_TYPES'].clear();
  Xdb.AddonSettings = {
    "REQUIRE_SIGNING": false,
    "LANGPACKS_REQUIRE_SIGNING": false,
    "ALLOW_LEGACY_EXTENSIONS": true,
  };

  let manifest = Cc['@mozilla.org/file/directory_service;1']
    .getService(Ci.nsIProperties).get('GreD', Ci.nsIFile);
  manifest.append('chrome.manifest');
  Components.manager.QueryInterface(Ci.nsIComponentRegistrar)
    .autoRegister(manifest);

  const {AddonManager} = Cu.import('resource://gre/modules/AddonManager.jsm');
  const {BootstrapLoader} = Cu.import('chrome://legacy/content/BootstrapLoader.jsm');
  AddonManager.addExternalExtensionLoader(BootstrapLoader);
} catch(ex) {
  Components.utils.reportError(ex.message);
}
