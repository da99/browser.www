
require "da_router"
require "json"
require "colorize"

PORT = 3010


def pass_fail_color(s : String)
  s = s.gsub(/(Scratch was loaded|PASS)([a-z]{2})?/i) do |s|
    s.colorize(:green)
  end
  s = s.gsub(/FAIL([a-z]{2})?/i) do |s|
    s.colorize(:red)
  end
  s
end # === def pass_fail_color

class Router

  @@scratch_file = HTTP::StaticFileHandler.new("scratch/", false)
  @@static_file  = HTTP::StaticFileHandler.new("specs/browser", false)
  @@tmp_file     = HTTP::StaticFileHandler.new("tmp", false)

  include DA_ROUTER

  @request_body = ""

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

  def self.write_json(ctx, o)
    r = ctx.response
    r.content_type = "application/json"
    r.headers["Access-Control-Allow-Origin"] = "*"
    r << o.to_json
  end # === def self.json

  def write_json(o)
    r = ctx.response
    r.content_type = "application/json"
    r.headers["Access-Control-Allow-Origin"] = "*"
    r << o.to_json
  end

  get("/") do
    ctx.request.path = "/index.html"
    @@static_file.call(ctx)
  end

  get("/scratch") do
    ctx.request.path = "/index.html"
    @@scratch_file.call(ctx)
  end

  get("/scratch.js") { @@tmp_file.call(ctx) }

  get("/favicon.ico") { @@scratch_file.call(ctx) }
  get("/loader.gif") { @@scratch_file.call(ctx) }
  get("/css/:name") { |name| @@scratch_file.call(ctx) }

  get("/browser.js") {
    @@tmp_file.call(ctx)
  }

  post("/") do
    write_json({when: "for now"})
  end

  get("/_csrf") do
    write_json({_csrf: "some_value"})
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

  post("/to-console") do
    puts "Browser says: #{pass_fail_color request_body}"
    write_json({success: "Received: #{request_body}"})
  end

  def request_body
    return @request_body unless @request_body.empty?
    origin = ctx.request.body
    return "" unless origin

    len = (ctx.request.content_length || 0).to_i
    raise Exception.new("Body too big.") if len > 1_000_000

    return "" if len < 1
    return "" unless origin
    @request_body = ( origin.gets(len) || raise Exception.new("No body sent.") )
  end

  post("/repeat") do
    write_json({ok: true, data: request_body, about: "data received: #{request_body.to_json}" })
  end

  post("/json") do
    write_json({msg: "get smart"})
  end

  get("/do-reload") do
    file = "tmp/do-reload"
    msg = if File.exists?(file)
            File.stat(file).mtime.to_s
          else
            ""
          end
    write_json({msg: msg})
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
    write_json(ctx, {msg: "not found: #{ctx.request.method} #{ctx.request.path}"})
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
      puts "=== Process gone: #{pid}. Server is exiting..."
      server.close
      break
    end
  }
}

puts("Server: http://localhost:#{PORT}");
server.listen


