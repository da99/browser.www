
require "kemal"


SOCKETS = [] of HTTP::WebSocket

spawn {
  reload_txt = "public/reload.txt"
  loop {
    break unless Kemal.config.running
    if File.exists?(reload_txt)
      SOCKETS.each { |s| s.send "yes" }
      File.delete(reload_txt)
    end
    sleep 0.5
  }
}

get "/" do |env|
  # env.response.headers.add("Access-Control-Allow-Origin", "localhost:3000")
  env.response.headers.add("Content-Security-Policy", "default-src 'self'; script-src http://localhost:3000; script-src-elem http://localhost:3000")
  File.read("public/index.html").gsub("{unix_epoch}", Time.utc.to_unix)
end

ws "/reload.txt" do |socket|
  SOCKETS << socket
  socket.on_message { |message| puts "invalid message: #{message.inspect}" }
  socket.on_close { SOCKETS.delete socket }
end


Kemal.run
