// keep this comment
try {
  let {XPIDatabase} = Cu.import('resource://gre/modules/addons/XPIDatabase.jsm', {});
  XPIDatabase.isDisabledLegacy = (addon) => false;
  XPIDatabase.mustSign = (aType) => false;

  const {FileUtils} = Cu.import('resource://gre/modules/FileUtils.jsm');
  Components.manager.QueryInterface(Ci.nsIComponentRegistrar)
    .autoRegister(FileUtils.getFile('GreD', ['legacy.manifest']));

  const {AddonManager} = Cu.import('resource://gre/modules/AddonManager.jsm');
  const {BootstrapLoader} = Cu.import('resource://legacy/BootstrapLoader.jsm');
  AddonManager.addExternalExtensionLoader(BootstrapLoader);
} catch(ex) {
  Components.utils.reportError(ex.message);
}
