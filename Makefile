.PHONY: all clean install uninstall

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
