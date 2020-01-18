// keep this comment
try {
  let Xdb = Cu.import('resource://gre/modules/addons/XPIDatabase.jsm', {});
  Xdb.XPIDatabase.isDisabledLegacy = (addon) => false;
  Xdb.XPIDatabase['SIGNED_TYPES'].clear();
  Xdb.AddonSettings = {
    "REQUIRE_SIGNING": false,
    "LANGPACKS_REQUIRE_SIGNING": false,
    "ALLOW_LEGACY_EXTENSIONS": true, // <=fx73
    "EXPERIMENTS_ENABLED": true, // >=fx74
    "DEFAULT_THEME_ID": "default-theme@mozilla.org",
  };

  const {FileUtils} = Cu.import('resource://gre/modules/FileUtils.jsm');
  Components.manager.QueryInterface(Ci.nsIComponentRegistrar)
    .autoRegister(FileUtils.getFile('GreD', ['legacy.manifest']));

  const {AddonManager} = Cu.import('resource://gre/modules/AddonManager.jsm');
  const {BootstrapLoader} = Cu.import('resource://legacy/BootstrapLoader.jsm');
  AddonManager.addExternalExtensionLoader(BootstrapLoader);
} catch(ex) {
  Components.utils.reportError(ex.message);
}
