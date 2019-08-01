#!/usr/bin/env python
import sys

if (sys.version_info > (3, 0)):
  import http.server
  server_pkg = http.server
else:
  import SimpleHTTPServer
  server_pkg = SimpleHTTPServer

class MyHTTPRequestHandler(server_pkg.SimpleHTTPRequestHandler):
    # append headers to disable caching which is super annoying
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        server_pkg.SimpleHTTPRequestHandler.end_headers(self)

if __name__ == '__main__':
    server_pkg.test(HandlerClass=MyHTTPRequestHandler)
