
external Error, setTimeout, window;
import System;
import DA_STANDARD.SPECS;
import DA_STANDARD.COMMON;

module DA_STANDARD.BROWSER
{

  void wait_max_seconds_specs() {
    int i = 0;
    wait_max_seconds(2, bool () { i = i + 1; if (i === 4) { return true; } return false; });
    THE_SPECS.timeout(bool () { return i === 4; }, void () { should_eq(4, i); });
  } // void wait_max_specs

  void wait_max_seconds(int seconds, bool() func) {
  } // === void wait_max

} // === module DA_STANDARD.BROWSER

