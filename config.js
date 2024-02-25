// keep this comment
try {
  let {XPIDatabase} = Cu.import('resource://gre/modules/addons/XPIDatabase.jsm', {});
  XPIDatabase.isDisabledLegacy = (addon) => false;
  XPIDatabase.mustSign = (aType) => false;

  const Services = globalThis.Services || Cu.import("resource://gre/modules/Services.jsm").Services;
  let manifest = Services.dirsvc.get('GreD', Ci.nsIFile);
  manifest.append('legacy.manifest');
  Components.manager.QueryInterface(Ci.nsIComponentRegistrar).autoRegister(manifest);

  const {AddonManager} = Cu.import('resource://gre/modules/AddonManager.jsm');
  const {BootstrapLoader} = Cu.import('resource://legacy/BootstrapLoader.jsm');
  AddonManager.addExternalExtensionLoader(BootstrapLoader);
} catch(ex) {
  Components.utils.reportError(ex.message);
}
