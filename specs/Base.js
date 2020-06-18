
function is_dev_specs() {
  should_eq(true, is_dev());
}

function is_function_specs() {
  should_eq(true,  is_function(function () {}));
  should_eq(false, is_function(1));
}

function is_null_specs() {
  should_eq(true,  bool () { return is_null(null); });
  should_eq(false, bool () { return is_null(undefined); });
}

function is_undefined_specs() {
  should_eq(true,  bool () { return is_undefined(undefined); });
  should_eq(false, bool () { return is_undefined(null); });
}

function is_enumerable_specs() {
  should_eq(true,  bool () { return is_enumerable(["a"]); });
  should_eq(true,  bool () { return is_enumerable({"a": "b"}); });
  should_eq(true, bool () { return is_enumerable("a"); });
}

function is_error_specs() {
  should_eq(true,  bool () { return is_error(new Error('anything')); });
  should_eq(false, bool () { return is_error('anything'); });
  should_eq(true,  bool () { return is_error(new Error('meh')); });
  should_eq(true,  bool () { return is_error(new TypeError('meow')); });
  should_eq(false, bool () { return is_error({stack: "", message: ""}); });
}

function is_nothing_specs() {
  should_eq(true,  bool () { return is_nothing(null); });
  should_eq(true,  bool () { return is_nothing(undefined); });
  should_eq(false, bool () { return is_nothing([]); });
  should_eq(false, bool () { return is_nothing({}); });
  should_eq(false, bool () { return is_nothing({a: "c"}); });
}

function is_empty_specs() {
  should_eq(true,  bool () { return is_empty([]); });
  should_eq(true,  bool () { return is_empty({}); });
  should_eq(true,  bool () { return is_empty(""); });
  should_eq(false, bool () { return is_empty({a: "c"}); });
  should_eq(false, bool () { return is_empty([1]); });
  should_eq(false, bool () { return is_empty("a"); });
  should_eq(true,  bool () { return is_empty(return_arguments()); });
  should_eq(false, bool () { return is_empty(return_arguments(1,2,3)); });
  should_eq(true,  bool () { return is_empty(""); });
  should_eq(false, bool () { return is_empty("a"); });
  should_eq(false, bool () { return is_empty("  "); });
}

function is_something_specs() {
  should_eq(false, bool () { return is_something(null); });
  should_eq(false, bool () { return is_something(undefined); });
  should_eq(true,  bool () { return is_something([]); });
  should_eq(true,  bool () { return is_something({}); });
  should_eq(true,  bool () { return is_something({a: "c"}); });
}

  function to_string_specs() {
    should_eq('null',              string () { return to_string(null); });
    should_eq('undefined',         string () { return to_string(undefined); });
    should_eq('[1]',               string () { return to_string([1]); });
    should_eq('"yo yo"',           string () { return to_string('yo yo'); });
    should_eq('{"a":"b","c":"d"}', string () { return to_string({a:'b', c:'d'}); });
  }

  function own_property_specs() {
    should_eq(3, own_property('num', {num: 3}));
    should_eq(undefined, own_property('num', {n:4}));
  }


  function to_array_specs() {
    should_eq([1,2,3], function () { return to_array([1,2,3]); });
    should_eq([1,2,3], function () { return to_array(return_arguments(1,2,3)); });
  }

  function repeat_specs() {
    should_eq(5, int () { int i = 1; repeat(4, function () { i = i+1; }); return i; });
    should_eq(4, int () { int i = 0; repeat(4, void () { i = i+1; }); return i; });
    should_eq(3, int () { int i = -1; repeat(4, int () { i = i+1; }); return i; });
  }

