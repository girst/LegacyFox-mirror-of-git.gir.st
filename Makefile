.PHONY: all clean install uninstall diff

files := config.js
files += defaults/pref/config-prefs.js
files += legacy.manifest
files += legacy/BootstrapLoader.sys.mjs
files += legacy/RDFDataSource.sys.mjs
files += legacy/RDFManifestConverter.sys.mjs
archive = legacyfox.tar.gz
DESTDIR ?= $(wildcard /usr/lib??/firefox/)

all: $(archive)
$(archive): $(files)
	tar czf $@ -- $(files)

clean:
	rm -f $(archive)

install: $(archive)
	tar xzf $(archive) -C "$(DESTDIR)"

uninstall:
	cd "$(DESTDIR)" && rm -rf -- $(files)

diff:
	@curl -sL https://hg.mozilla.org/comm-central/raw-file/8a37a90aab4ec643fce1e1ab33984613ce0b492d/common/src/BootstrapLoader.jsm | diff --color -u - legacy/BootstrapLoader.sys.mjs ||:
	@curl -sL https://hg.mozilla.org/comm-central/raw-file/8a37a90aab4ec643fce1e1ab33984613ce0b492d/common/src/RDFDataSource.jsm | diff --color -u - legacy/RDFDataSource.sys.mjs ||:
	@curl -sL https://hg.mozilla.org/comm-central/raw-file/8a37a90aab4ec643fce1e1ab33984613ce0b492d/common/src/RDFManifestConverter.jsm | diff --color -u - legacy/RDFManifestConverter.sys.mjs ||:
