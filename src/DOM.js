


function body() {
  let node = document.getElementsByTagName("body")[0];
  for (let i = 0, j = arguments.length; i < j; i++){
    switch(typeof(arguments[i])) {
      case 'object':
        node.appendChild(arguments[i]);
        break;
      default:
        console.log("Invalid argument for id(): " + typeof(arguments[i]) + " " + arguments[i].toString());
    }
  }
  return node;
} // func

function id() {
  let str_id = arguments[0];
  let node   = document.getElementById(str_id);

  return(new NODE(node));
}

function para() {
  return new_element("p", arguments);
} // func

// Example: a_href("http://www.lewrockwell.com", "My Text");
function a_href() {
  let new_args = [];
  for (let i = 0, j = arguments.length; i < j; ++i) {
    if (i == 0) {
      new_args.push({href: arguments[i]});
    } else {
      new_args.push(arguments[i]);
    }
  }
  return new_element("a", new_args);
} // func

function new_element(name, args) {
  let node = document.createElement(name);
  for (let i = 0, j = args.length; i < j; i++){
    switch(typeof(args[i])) {
      case 'string':
        node.appendChild(document.createTextNode(args[i]));
        break;
      case 'object':
        if (args[i].constructor == Object) {
          for (const property in args[i]) {
            node.setAttribute(property, args[i][property]);
          }
        } else {
          node.appendChild(args[i]);
        }
        break;
      default:
        console.log("Invalid argument for id(): " + typeof(args[i]) + " " + args[i].toString());
    }
  } // for
  return node;
} // func

function span() {
  switch(arguments.length) {
    case 1:
      return new_element("span", [document.createTextNode(arguments[0])]);
      break;
    default:
      return new_element("span", arguments);
  }
} // func

function div() {
  return new_element("div", arguments);
} // func

function html_unescape_all(raw) {
  // From: http://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
  return (new window.DOMParser().parseFromString(raw, "text/html")).documentElement.textContent;
}


function dom_id(x) {
  let n = new NODE(x);
  let current = n.attr("id");
  if (current.length === 0) {
    current = ID.next("ele_");
    n.attr("id", current);
  }
  return current;
}


var ID = {
  last: -1,
  next: function next(prefix = "") {
    ID.last = ID.last + 1;
    return trim(prefix) + ID.last.toString();
  }
};

var DOC = {};

// =============================================================================
// === DOC.NODE
// =============================================================================

DOC.NODE = function NODE(raw = undefined) {

  this.origin = undefined;
  this.is_node = true;

  if (typeof raw === "object" && raw.is_node) {
    this.origin = raw.origin;
    return;
  }

  if (typeof raw === "object" && raw.getAttribute) {
    this.origin = raw;
    return;
  }

  if (typeof raw === "string") {
    let e = document.querySelector(v);
    if (!e) { throw new Error("Unable to find element with selector: " + v); }
    this.origin = e;
    return;
  }

  if(!this.origin) {
    throw new Error("Invalid origin for NODE: " + to_string(v));
  }

}; // === function NODE

NODE.prototype.append = function append() {
  for (let i = 1, j = arguments.length; i < j; i++){
    switch(typeof(arguments[i])) {
      case 'object':
        this.origin.appendChild(arguments[i]);
        break;
      default:
        console_log("Invalid argument for id(): " + typeof(arguments[i]) + " " + arguments[i].toString());
        return false;
    } // switch
  } // for
  return true;
};

NODE.prototype.exists = function exists(str) { return !!(this.origin.querySelector(str)); };
NODE.prototype.outer_html = function to_html() { return this.origin.outerHTML; };
NODE.prototype.inner_html = function inner_html() { return this.origin.innerHTML; };


NODE.prototype.text = function text(x) {
  if (arguments.length == 1) {
    this.origin.textContent = arguments[0];
  }
  return this.origin.textContent;
};

NODE.prototype.show = function show() {
  this.origin.style.display = "";
  return this;
};

NODE.property.matches = function(_args) {
  let names = "matches,matchesSelector,msMatchesSelector,webkitMatchesSelector".split(",");
  for (int i=0; i<names.length; i++) {
    let f = this.origin[names[i]];
    if (f) { return(f.apply(this.origin, arguments)); }
  }
  return false;
};

NODE.prototype.closest = function closest(selector) {
  let raw_node;
  if (this.origin.closest) {
    raw_node = this.origin.closest(selector);
    if (!raw_node) {
      throw new Error("No closest node found for: " + selector);
    }
    return new NODE(raw_node);
  }

  raw_node = this.origin.parentElement;
  NODE n;

  while (raw_node && raw_node.tagName != "body") {
    n = new NODE(raw_node);
    if (n.matches(selector))
      return n;
    raw_node = n.origin.parentElement;
  }

  throw new Error("No closest node found for: " + selector);
};

NODE.prototype.remove = function remove() {
  if (this.origin.removeNode) {
    this.origin.removeNode();
    return;
  }
  this.origin.remove();
};

NODE.prototype.hide = function hide() {
  this.origin.style.display = "none";
  return this;
};

NODE.prototype.add_class = function add_class(new_class) {
  this.origin.classList.add(new_class);
  return this;
};

NODE.prototype.remove_class = function remove_class(target) {
  this.origin.classList.remove(target);
  return this;
};

NODE.prototype.has_class = function has_class(target) {
  return this.origin.classList.contains(target);
};

NODE.prototype.has_attr = function (raw_name) {
  let val = attr(trim(raw_name));
  if (is_nothing(val) || is_empty(val))
    return false;
  return true;
};

NODE.prototype.prevent_default_event = function () {
  let funcs = "stopPropagation,stopImmediatePropagation,preventDefault".split(",");
  let x = this.origin;
  for (let i = 0; i < funcs.length; i++) {
    if (x[funcs[i]]) {
      return x[funcs[i]]();
    }
  }
};

// Special cases:
//   dom! - Gets or sets id
NODE.prototype.attr = function (raw_name, raw_val) {
  switch(arguments.length) {
    case 1:
      if (raw_name === "id!") {
        let old = this.attr('id');

        if (!is_empty(old))
          return old;

        var str = ID_STATE.new_id("ele_");
        this.attr('id', str);
        return str;
      }

      let name = trim(raw_name);
      return trim( this.origin.getAttribute(name) || "" );
      break;

    case 2:
      let name = trim(raw_name);
      let val  = trim(raw_val);
      this.origin.setAttribute(name, val);
      return this;
      break;
  }
}; // function

NODE.prototype.node_list = function (q) {
  return new NODE_LIST(this.origin.querySelectorAll(q));
};


// =============================================================================
// === DOC.NODE.LIST
// =============================================================================
DOC.NODE.LIST = function NODE_LIST(raw) {
  this.origin = undefined;

  if (typeof raw === "object" && raw.constructor == NodeList) {
    this.origin = raw;
    return;
  }

  if (typeof raw === "string") {
    this.origin = document.querySelectorAll(raw_query);
    return;
  }

  if (!this.origin) {
    throw new Error("Invalid origin for NODE.LIST: " + to_string(raw));
  }

}; // class NodeList

Object.defineProperties(DOC.NODE.LIST, {
  'length': { get: function length() { return this.origin.length; } }
});

DOC.NODE.LIST.prototype.item = function(i) { return new DOC.NODE(this.origin[i]); };

DOC.NODE.LIST.prototype.add_class = function(new_name) {
  let l = this.origin.length;
  for(let i = 0; i < l; i++) {
    this.item(i).add_class(new_name);
  }
  return this;
};

DOC.NODE.LIST.prototype.remove_class = function(target) {
  let l = this.origin.length;
  for(let i = 0; i < l; i++) {
    this.item(i).remove_class(target);
  }
  return this;
};
