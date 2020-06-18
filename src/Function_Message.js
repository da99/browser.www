

// === Handlers ====
var Function_Message = {groups : {}};

Function_Message.add_handler = function add_handler(name, func) {
  if (!Function_Message.groups[name]) {
    Function_Message.groups[name] = [];
  }
  Function_Message.groups[name].push(func);
  return true;
}; // func

Function_Message.send = function send_message(name, data) {
  let groups = Function_Message.groups[name];
  if (!groups) {
    return false;
  }
  for (let i = 0, stop_at = groups.length; i < stop_at; i++) {
    groups[i](data);
  }
}; // func


