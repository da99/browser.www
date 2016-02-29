/* jshint strict: true, undef: true */
/* globals spec_returns */

spec_returns(true,  function () { "use strict"; return is(5)(5); });
spec_returns(false, function () { "use strict"; return is("a")("b"); });
function is(target) {
  "use strict";

  return function (val) { return val === target; };
}