
require "da_router"
require "json"

PORT = 3010


class Router

  @@static_file = HTTP::StaticFileHandler.new("specs/browser", false)
  @@tmp_file = HTTP::StaticFileHandler.new("tmp", false)

  include DA_ROUTER

  def resp
    ctx.response
  end

  def write_text(str : String)
    ctx.response.content_type = "text/plain"
    ctx.response << str
  end

  def write_html(str : String)
    ctx.response.content_type = "text/html"
    ctx.response << str
  end # === def write_html

  def write_css(str : String)
    ctx.response.content_type = "text/css"
    ctx.response << str
  end # === def write_html

  def write_js(str : String)
    ctx.response.content_type = "application/javascript"
    ctx.response << str
  end # === def write_html

  def self.json(ctx, o)
    r = ctx.response
    r.content_type = "application/json"
    r.headers["Access-Control-Allow-Origin"] = "*"
    r << o.to_json
  end # === def self.json

  def json(o)
    r = ctx.response
    r.content_type = "application/json"
    r.headers["Access-Control-Allow-Origin"] = "*"
    r << o.to_json
  end

  get("/") do
    ctx.request.path = "/index.html"
    @@static_file.call(ctx)
  end

  get("/favicon.ico") { @@static_file.call(ctx) }
  get("/css/:name") { @@static_file.call(ctx) }

  get("/browser.specs.js") {
    @@tmp_file.call(ctx)
  }

  post("/") do
    json({when: "for now"})
  end

  get("/_csrf") do
    json({_csrf: "some_value"})
  end

  post("/html") do
    write_html "<html><body>Some html.</body></html>"
  end

  post("/404-html") do
    resp.status_code = 404
    write_html "<p>Not found: #{ctx.request.path}</p>"
  end

  post("/string-as-html") do
    write_html("Some invalid html.")
  end

  post("/text") do
    write_text("Some plain text.");
  end

  def request_body
    (ctx.request.body || "").to_s
  end

  post("/repeat") do
    json({ok: true, data: request_body, about: "data received: #{request_body.to_json}" })
  end

  post("/json") do
    json({msg: "get smart"})
  end

  # post("/client-error-to-stdout") do
  #   FS.writeFileSync("tmp/catch.browser.js.txt", req.body.message + "\n" + req.body.stack);
  #   json({ok: true})
  # end

  # post("/all-specs-pass") do
  #   FS.writeFileSync("tmp/browser.js.results", JSON.stringify(req.body));
  #   json({ok: true})
  # end

  def self.fulfill(ctx)
    DA_ROUTER.route!(ctx)
    ctx.response.status_code = 404
    json(ctx, {msg: "not found: #{ctx.request.method} #{ctx.request.path}"})
    route(ctx) do
    end
  end # === def self.fulfill

end # === class Router

server = HTTP::Server.new(PORT) do |ctx|
  Router.fulfill(ctx)
end

pid = ENV["CONTROLLER_PID"]

spawn {
  loop {
    system("kill -0 #{pid}")
    is_alive = $?.normal_exit? && $?.exit_code == 0

    if !is_alive
      puts "=== Process gone: #{pid}. Exiting."
      server.close
      break
    end
  }
}

puts("Server: http://localhost:#{PORT}");
server.listen


