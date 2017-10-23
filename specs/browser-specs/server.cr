
require "da_router"
require "json"

PORT = 3010


class Router

  include DA_ROUTER
  HTML = File.read("specs/browser-specs/specs.html")
  SPECS_JS = File.read("tmp/specs.js")

  def self.fulfill(ctx)
    route(ctx) do
      post("/", Router, :slash)
      get("/specs", Router, :specs_html)
      get("/specs.js", Router, :specs_js)
      get("/_csrf", Router, :_csrf)
      post("/html", Router, :html)
      post("/404-html", Router, :html_404)
      post("/string-as-html", Router, :string_as_html)
      post("/text", Router, :text)
      # post("/all-specs-pass", Router, :all_specs_pass)
      post("/repeat", Router, :repeat)
      post("/json", Router, :json)
      # post("/client-error-to-stdout", Router, :client_error_to_stdout)

      ctx.response.status_code = 404
      json(ctx, {msg: "not found: #{ctx.request.method} #{ctx.request.path}"})
    end
  end # === def self.fulfill

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

  def get_specs_html
    write_html HTML
  end

  def get_specs_js
    write_js SPECS_JS
  end

  def post_slash
    json({when: "for now"})
  end

  def get__csrf
    json({_csrf: "some_value"})
  end

  def post_html
    write_html "<html><body>Some html.</body></html>"
  end

  def post_html_404
    resp.status_code = 404
    write_html "<p>Not found: #{ctx.request.path}</p>"
  end

  def post_string_as_html
    write_html("Some invalid html.")
  end

  def post_text
    write_text("Some plain text.");
  end

  # def post_all_specs_pass
  #   FS.writeFileSync("tmp/browser.js.results", JSON.stringify(req.body));
  #   json({ok: true})
  # end

  def request_body
    (ctx.request.body || "").to_s
  end

  def post_repeat
    json({ok: true, data: request_body, about: "data received: #{request_body.to_json}" })
  end

  def post_json
    json({msg: "get smart"})
  end

#   def post_client_error_to_stdout
#     FS.writeFileSync("tmp/catch.browser.js.txt", req.body.message + "\n" + req.body.stack);
#     json({ok: true})
#   end

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


