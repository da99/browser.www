
specs () {
  local +x TMP="/tmp/da_standard"
  reset-fs () {
    rm -rf "$TMP"
    mkdir -p "$TMP"
  }

  # ===========================================================================
  reset-fs
  cd "$TMP"
  mkdir -p lib/browser/aquaman
  touch    lib/browser/aquaman/a.js

  mkdir -p lib/nodejs/superman
  touch    lib/nodejs/superman/a.js

  should-exit 1 'da_standard.jspp duplicate-functions'
  # ===========================================================================


  # ===========================================================================
  reset-fs
  cd "$TMP"
  mkdir -p lib/aquaman/a.js
  mkdir -p lib/superman/b.js
  should-exit 0 'da_standard.jspp duplicate-functions'
  # ===========================================================================

} # === function specs

specs
