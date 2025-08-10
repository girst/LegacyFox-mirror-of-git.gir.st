/**
 * Replacements for Components.manager.addBootstrappedManifestLocation and
 * Components.manager.removeBootstrappedManifestLocation, which have been nixed
 * in mozilla142. Based on ideas from Github users onemen and 117649.
 * Copyright 2025 Tobias Girstmair <https://gir.st/>, MPLv2.
 */

const ScriptableInputStream = Components.Constructor(
  "@mozilla.org/scriptableinputstream;1",
  "nsIScriptableInputStream",
  "init"
);

const FileOutputStream = Components.Constructor(
  "@mozilla.org/network/file-output-stream;1",
  "nsIFileOutputStream",
  "init"
);

export class LegacyFoxUtils {
  static addBootstrappedManifestLocation(file, addon, uriMaker) {
    // read chrome.manifest from .jar (or unpacked addon)
    let channel = Services.io.newChannelFromURI(
      uriMaker(file, "chrome.manifest"),
      null, // aLoadingNode
      Services.scriptSecurityManager.getSystemPrincipal(),
      null, // aTriggeringPrincipal
      Ci.nsILoadInfo.SEC_ALLOW_CROSS_ORIGIN_SEC_CONTEXT_IS_NULL,
      Ci.nsIContentPolicy.TYPE_OTHER
    );
    let available, manifestContents = "";
    let stream = channel.open(), sstream = new ScriptableInputStream(stream);
    while ((available = sstream.available()) > 0)
      manifestContents += sstream.read(available);
    sstream.close(), stream.close();

    // replace chrome:// and resource:// URIs with absolute paths to JAR
    manifestContents = manifestContents
      .split("\n")
      .map(absolutizePaths.bind(null, uriMaker, file))
      .join("\n");

    // we store the temporary file in the user's profile, in a subdirectory
    // analogous to webExtension's "browser-extension-data". the startupCache(?)
    // sometimes interferes with us, so we name the file differently each time.
    let manifest = Services.dirsvc.get('ProfD', Ci.nsIFile)
    manifest.append('legacy-extension-data');
    manifest.append(addon.id);
    manifest.exists() || manifest.create(Ci.nsIFile.DIRECTORY_TYPE, 0o755);
    manifest.append(`${Date.now()}.manifest`); /* created or truncated by ostream */

    // write modified chrome.manifest to profile directory
    let ostream = new FileOutputStream(manifest, -1, -1, 0);
    ostream.write(manifestContents, manifestContents.length);
    ostream.close();

    // let Firefox read and parse it
    Components.manager.QueryInterface(Ci.nsIComponentRegistrar).autoRegister(manifest);
  }

  static removeBootstrappedManifestLocation(addon) {
    let manifestDir = Services.dirsvc.get('ProfD', Ci.nsIFile)
    manifestDir.append('legacy-extension-data');
    manifestDir.append(addon.id);
    manifestDir.exists() && manifestDir.remove(/*recursive=*/true);
    Cc['@mozilla.org/chrome/chrome-registry;1']
      .getService(Ci.nsIXULChromeRegistry).checkForNewChrome();
  }
}

function absolutizePaths(uriMaker, file, line) {
  const manifestMethodPathLocation = {
    content: 2, // content packagename uri/to/files/ [flags]
    locale: 3,  // locale packagename localename uri/to/files/ [flags]
    skin: 3,    // skin packagename skinname uri/to/files/ [flags]
    resource: 2 // resource aliasname uri/to/files/ [flags]
  };

  let words = line.trim().split(/\s+/);
  const index = manifestMethodPathLocation[words[0]];

  if (index) {
    words[index] = uriMaker(file, words[index]).spec;
    line = words.join(" ");
  }

  return line;
}
