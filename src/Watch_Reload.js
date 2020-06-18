
function Watch_Reload() {
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

