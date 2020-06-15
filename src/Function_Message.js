

// === Handlers ====
var Handlers = {groups : {}};

Handlers.add = function add_handler(name, func) {
  if (!Handlers.groups[name]) {
    Handlers.groups[name] = [];
  }
  Handlers.groups[name].push(func);
  return true;
}; // func

Handlers.run = function run_handler(name, data) {
  let groups = Handlers.groups[name];
  if (!groups) {
    console.log("no log actions found for: " + name);
    return false;
  }
  for (let i = 0, stop_at = groups.length; i < stop_at; i++) {
    groups[i](data);
  }
}; // func

Handlers.watch_reload = function watcher() {
  var ws = new WebSocket("ws://localhost:3000/reload.txt");

  ws.onopen = function (event) {
    console.log("Opened");
    console.log(event);
  }

  ws.onmessage = function (event) {
    if (event.data == "yes") {
      document.location.reload();
    } else {
      console.log(event);
    }
  }
}; // func



