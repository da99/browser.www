
function update_text(node, x) {
  switch (x.constructor) {
    case String:
      node.innerText = x;
      break;
    default:
      console.log("Invalid value for DOM update.");
  }
  return node;
} // func


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

var ID = {
  last: -1,
  next: function next(prefix = "") {
    ID.last = ID.last + 1;
    return trim(prefix) + ID.last.toString();
  }
};

function dom_id(x) {
  let n = new NODE(x);
  let current = n.attr("id");
  if (current.length === 0) {
    current = ID.next("ele_");
    n.attr("id", current);
  }
  return current;
}


var DOC = {
node: function node(s) {
        return new DOC.NODE(document.querySelector(s));
      },

node_list: function node_list(s) {
    return new DOC.NODE_LIST(document.querySelectorAll(s));
  },

add_event:  function add_event(event_name, selector, f) {
              document.addEventListener(event_name, function (e) {
                  if (!e.target.matches(selector))
                  return; f(e);
                  });
            },
NODE_LIST: function NODE_LIST() {
  this.origin = null;

  this.length = function length() {
    return this.origin.length;
  };

  this.NODE_LIST(v) = function() {
    this.origin = v;
  };

  this.item = function(i) {
    return new DOC.NODE(this.origin[i]);
  };

  this.add_class = function(new_name) {
    let l = this.origin.length;
    for(let i = 0; i < l; i++) {
      this.item(i).add_class(new_name);
    }
    return this;
  };

  this.remove_class = function(target) {
    let l = this.origin.length;
    for(let i = 0; i < l; i++) {
      this.item(i).remove_class(target);
    }
    return this;
  };

} // class NodeList

};

function NODE(raw = undefined) {

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

} // === function NODE

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

NODE.prototype.exists = function exists(v) {
  if (document.querySelector(v))
    return true;
  return false;
};

NODE.prototype.html       = function html() { return this.origin.innerHTML; };
NODE.prototype.outer_html = function outer_html() { return this.origin.outerHTML; };
NODE.prototype.text       = function text() { return this.origin.textValue; };

NODE.prototype.show = function show() {
  this.origin.style.display = "";
  return this;
};

NODE.property.matches = function(raw) {
  let names = "matches,matchesSelector,msMatchesSelector,webkitMatchesSelector".split(",");
  for (int i=0; i<names.length; i++) {
    if (this.origin[names[i]])
      return(this.origin[names[i]](raw));
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

