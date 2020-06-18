
function ID_STATE_specs() {
  should_eq(1, int () { return ID_STATE.new_id(); });
  should_eq(2, int () { return ID_STATE.new_id(); });
}

function doc_node_specs() {
  THE_STAGE.reset('<div id="query_selector_id">hello</div>');
  should_eq("hello", DOC.node("#query_selector_id").html());
}

function doc_node_list_specs() {
  THE_STAGE.reset('<div class="node_list">hello</div><div class="node_list">hello 2</div>');
  should_eq(2, DOC.node_list("div.node_list").length());
}

function html_unescape_all_specs() {
  should_eq('<p>{{1}}</p>', html_unescape_all("&lt;p&gt;&#123;&#123;1&#125;&#125;&lt;/p&gt;"));
}

function node_add_class_specs() {
  THE_STAGE.reset('<div>hello</div>');
  DOC.node("#THE_STAGE div").add_class("red_hot");
  should_eq(1, DOC.node_list("div.red_hot").length());
}

function node_hide_specs() {
  THE_STAGE.reset('<div id="hide_factor">Factor</div>');
  DOC.node("#hide_factor").hide();
  should_eq("none", document.querySelector("#hide_factor").style.display);
}

function node_show_specs() {
  THE_STAGE.reset('<div id="show_factor" style="display: inline">Factor</div>');
  DOC.node("#show_factor").hide();
  DOC.node("#show_factor").show();
  should_eq("", document.querySelector("#show_factor").style.display);
}

function node_outer_html_specs() {
  string html = '<div id="node_outer_html">hello</div>';
  THE_STAGE.reset(html);
  should_eq(html, DOC.node('#node_outer_html').outer_html());
}
