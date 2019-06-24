// keep this comment
try {
  // monkey-patching to disable signing and force-enable legacy extensions:
  let Xdb = Cu.import('resource://gre/modules/addons/XPIDatabase.jsm', {});
  Xdb.XPIDatabase['SIGNED_TYPES'].clear();
  Xdb.AddonSettings = {
    "REQUIRE_SIGNING": false,
    "LANGPACKS_REQUIRE_SIGNING": false,
    "ALLOW_LEGACY_EXTENSIONS": true,
  };

  Cu.import('chrome://legacy/content/boot.jsm'); // engage the bootstrap loader
} catch(ex) {}
