
Watch_Reload();

function incr() {
  let node = id("the_count");
  let new_total = parseInt(node.text()) + 1;
  node.text(new_total.toString());
  console_log("Updated.");
  body(
    para(
      a_href(
        "http://www.lewrockwell.com",
        "New: ",
        (new Date()).getSeconds().toString()
      )
    )
  );
  Handlers.run("incr", {amount: 1});
  return null;
} // func

Handlers.add("on page load", function add_loaded_msg() {
  body(
    para({id: "init_p"},
      span("Page has loaded.")
    )
  );
});

Handlers.add("on page load", function set_button_incr() {
  id("incr_btn").onclick = incr;
});

Handlers.add("incr", function (data) {
    body(
      div({'class': 'skyblue'}, "Number increased by: " + data.amount)
    );
});

Handlers.run("on page load");

