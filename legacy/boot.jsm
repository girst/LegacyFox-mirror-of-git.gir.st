let EXPORTED_SYMBOLS = [];

const {AddonManager} = ChromeUtils.import('resource://gre/modules/AddonManager.jsm');
if (AddonManager.addExternalExtensionLoader) {
  const {BootstrapLoader} = ChromeUtils.import('chrome://legacy/content/BootstrapLoader.jsm');
  AddonManager.addExternalExtensionLoader(BootstrapLoader);
}
