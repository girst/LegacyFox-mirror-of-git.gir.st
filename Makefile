.PHONY: all install

files := chrome.manifest
files += config.js
files += defaults/pref/config-prefs.js
files += legacy/BootstrapLoader.jsm
files += legacy/RDFDataSource.jsm
files += legacy/RDFManifestConverter.jsm
archive = legacyfox.tar.gz
mozilladir = /usr/lib64/firefox/

all: $(archive)
$(archive): $(files)
	tar czf $@ -- $(files)

install: $(archive)
	tar xzf $(archive) -C $(mozilladir)
