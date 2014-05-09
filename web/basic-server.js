var http = require("http");
var URL = require("url");
var handler = require("./request-handler");
var dataHandler = require("./data-handler");

var port = 8080;
var ip = "127.0.0.1";

var routes = {
  "/urls": dataHandler.handleUrl
  // default: handler.handleRequest
};

var server = http.createServer(function(request, response) {
  var url = URL.parse(request.url);
  var route = routes[url.path];

  if ( route ) {
    route(request, response);
  } else {
    handler.handleRequest(request, response);
  }
});

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
