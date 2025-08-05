/**
 * Replacements for Components.manager.addBootstrappedManifestLocation and
 * Components.manager.removeBootstrappedManifestLocation, which have been nixed
 * in mozilla142. Copyright 2025 Tobias Girstmair <https://gir.st/>, MPLv2.
 */

const ZipReader = Components.Constructor(
  "@mozilla.org/libjar/zip-reader;1",
  "nsIZipReader",
  "open"
);

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
    let zipReader = new ZipReader(file);
    let istream = new ScriptableInputStream(zipReader.getInputStream("chrome.manifest"));
    let manifestContents = istream.read(zipReader.getEntry("chrome.manifest").realSize);

    // replace chrome:// and resource:// URIs with absolute paths to JAR
    manifestContents = manifestContents
      .split("\n")
      .map(absolutizePaths.bind(null, uriMaker, file))
      .join("\n");

    // write modified chrome.manifest to profile directory
    let manifest = constructManifestPath(addon);
    let ostream = new FileOutputStream(manifest, -1, -1, 0);
    ostream.write(manifestContents, manifestContents.length);
    ostream.close();

    // let Firefox read and parse it
    Components.manager.QueryInterface(Ci.nsIComponentRegistrar).autoRegister(manifest);
  }

  static removeBootstrappedManifestLocation(addon) {
    let manifest = constructManifestPath(addon);
    manifest.fileSize = 0; // truncate the manifest
    Cc['@mozilla.org/chrome/chrome-registry;1']
      .getService(Ci.nsIXULChromeRegistry).checkForNewChrome();
    manifest.remove(false);
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

function constructManifestPath(addon) {
  let manifest = Services.dirsvc.get('ProfD', Ci.nsIFile)
  manifest.append('legacy-extension-data');
  manifest.append(addon.id);
  manifest.append('chrome.manifest');

  manifest.exists() || manifest.create(Ci.nsIFile.NORMAL_FILE_TYPE, 0o644);

  return manifest;
}
