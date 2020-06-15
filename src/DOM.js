
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

  for (let i = 1, j = arguments.length; i < j; i++){
    switch(typeof(arguments[i])) {
      case 'object':
        node.appendChild(arguments[i]);
        break;
      default:
        console.log("Invalid argument for id(): " + typeof(arguments[i]) + " " + arguments[i].toString());
    }
  }
  return node;
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
