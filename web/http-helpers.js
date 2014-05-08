/* jshint quotmark:false */
/* global exports, require */

var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.send404 = function(response) {
  exports.sendResponse(response, 'This file doesn\'t exist. Why don\'t you try zombo.com?', 404);
};

exports.sendResponse = function(response, data, status) {
  status = status || 200;
  response.writeHead(status, exports.headers);
  if (typeof data !== 'string') {
    data = JSON.stringify(data);
  }
  response.end(data);
};

exports.serveAssets = function(res, asset) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  fs.readFile(asset, function(err, data) {
    if (!err) {
      // serve file
      exports.sendResponse(res, data.toString());
    } else {
      // throw 404
      exports.send404(res);
    }
  });

};

// As you progress, keep thinking about what helper functions you can put here!
