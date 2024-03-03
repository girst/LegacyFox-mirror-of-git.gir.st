// keep this comment
try {
  let {XPIDatabase} = ChromeUtils.importESModule('resource://gre/modules/addons/XPIDatabase.sys.mjs');
  XPIDatabase.isDisabledLegacy = (addon) => false;
  XPIDatabase.mustSign = (aType) => false;

  let manifest = Services.dirsvc.get('GreD', Ci.nsIFile);
  manifest.append('legacy.manifest');
  Components.manager.QueryInterface(Ci.nsIComponentRegistrar).autoRegister(manifest);

  const {AddonManager} = ChromeUtils.importESModule('resource://gre/modules/AddonManager.sys.mjs');
  const {BootstrapLoader} = ChromeUtils.importESModule('resource://legacy/BootstrapLoader.sys.mjs');
  AddonManager.addExternalExtensionLoader(BootstrapLoader);
} catch(ex) {
  Components.utils.reportError(ex.message);
}
