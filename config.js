// keep this comment
try {
  let Xdb = Cu.import('resource://gre/modules/addons/XPIDatabase.jsm', {});
  Xdb.XPIDatabase['SIGNED_TYPES'].clear();
  Xdb.AddonSettings = {
    "REQUIRE_SIGNING": false,
    "LANGPACKS_REQUIRE_SIGNING": false,
    "ALLOW_LEGACY_EXTENSIONS": true,
  };

  const {AddonManager} = Cu.import('resource://gre/modules/AddonManager.jsm');
  const {BootstrapLoader} = Cu.import('chrome://legacy/content/BootstrapLoader.jsm');
  AddonManager.addExternalExtensionLoader(BootstrapLoader);
} catch(ex) {
  Components.utils.reportError(ex.message);
}
