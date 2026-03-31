require 'socket'
dir = File.dirname(File.expand_path(__FILE__))
server = TCPServer.new('127.0.0.1', 8080)
loop do
  client = server.accept
  request = client.gets
  path = request&.split(' ')&.[](1) || '/'
  path = '/index.html' if path == '/'
  filepath = File.join(dir, path.sub(/^\//, ''))
  if File.exist?(filepath)
    body = File.read(filepath)
    ct = filepath.end_with?('.html') ? 'text/html' : filepath.end_with?('.css') ? 'text/css' : filepath.end_with?('.js') ? 'application/javascript' : 'text/plain'
    client.print "HTTP/1.1 200 OK\r\nContent-Type: #{ct}; charset=utf-8\r\nContent-Length: #{body.bytesize}\r\nConnection: close\r\n\r\n#{body}"
  else
    client.print "HTTP/1.1 404 Not Found\r\nContent-Length: 9\r\nConnection: close\r\n\r\nNot Found"
  end
  client.close
end
