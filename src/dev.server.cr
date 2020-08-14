
require "da_server"

class DHTML
  include HTTP::Handler

  def call(env)
    case
    when env.request.path == "/"
      env.response.content_type = "text/html; charset=UTF-8"
      env.response.print print_index(env)

    when env.request.path["/script/"]?
      env.response.content_type = "text/javascript; charset=UTF-8"
      env.response.print print_js_file(env)

    else
      call_next env

    end # case
  end # def

  def print_index(env)
    env.response.headers.add("Content-Security-Policy", "default-src 'self'; script-src http://localhost:3000; script-src-elem http://localhost:3000")
    File
      .read("public/index.html")
      .gsub("{unix_epoch}", Time.utc.to_unix)
  end # def

  def print_js_file(env)
    file_name = env.request.path.split("/")[2].gsub(/[^a-zA-Z0-9\.\-\_]/, "_")
    env.response.headers.add("Content-Type", "application/x-javascript")
    File.read("src/#{file_name}")
  end # def

end # === class
s = DA_Server.new(
  host: "0.0.0.0",
  port: 4567,
  user: ENV["USER"],
  handlers: [
    # Reload_Page.new,
    DHTML.new,
    HTTP::StaticFileHandler.new("public", false),
  ]
)
STDERR.puts "=== Starting server..."
s.listen


# require "kemal"
# SOCKETS = [] of HTTP::WebSocket

# spawn {
#   reload_txt = "public/reload.txt"
#   loop {
#     break unless Kemal.config.running
#     if File.exists?(reload_txt)
#       SOCKETS.each { |s| s.send "yes" }
#       File.delete(reload_txt)
#     end
#     sleep 0.5
#   }
# }

# get "/" do |env|
#   # env.response.headers.add("Access-Control-Allow-Origin", "localhost:3000")
#   env.response.headers.add("Content-Security-Policy", "default-src 'self'; script-src http://localhost:3000; script-src-elem http://localhost:3000")
#   File
#     .read("public/index.html")
#     .gsub("{unix_epoch}", Time.utc.to_unix)
# end

# get "/script/:raw_file" do |env|
# end

# ws "/reload.txt" do |socket, cxt|
#   SOCKETS << socket
#   socket.on_message { |message| puts "invalid message: #{message.inspect}" }
#   socket.on_close { SOCKETS.delete socket }
# end


# Kemal.run
