var path = require('path');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers.js');
// require more modules/folders here!

var getRequest = function(req, res) {
  var urlPath = url.parse(req.url).pathname;

  if (urlPath === '/') {
    http.serveAssets(res, './public/index.html');
  } else {
    http.send404(res);
  }
};

var actions = {
  'GET': getRequest
};

exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if (action) {
    action(req, res);
  } else {
    http.send404(res);
  }
};
