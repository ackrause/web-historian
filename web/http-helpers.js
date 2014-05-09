/* jshint quotmark:false */
/* global exports, require */

var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var _ = require('underscore');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
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

exports.sendRedirect = function (response, url) {
  response.writeHead(302, { Location: url });
  response.end();
};

exports.serveAssets = function(res, asset) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)

  // create an array of paths
  var paths = [];
  _.each(archive.paths, function(value){
    return paths.push(value);
  });

  // takes in filename as asset
  var serveFile = function(asset) {
  // pop of a path and try to readfile of path + asset
    fs.readFile(paths.pop() + '/' + asset, function(err, data) {
      // if exists, serve it
      if(!err) {
        exports.sendResponse(res, data.toString());
      } else {
      // if not
        // if path array is empty, 404 error
        if(paths.length === 0) {
          exports.send404(res);
        } else {
        // else recurse
          serveFile(asset);
        }
      }
    });
  };

  serveFile(asset);
};

// As you progress, keep thinking about what helper functions you can put here!
