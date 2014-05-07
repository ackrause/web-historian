var path = require('path');
var url = require('url');
var querystring = require('querystring');
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

var postRequest = function(req, res) {

  // figure out what the post data was
  var queryData = '';
  req.on('data', function(partialData) {
    queryData += partialData;
  });
  req.on('end', function() {
    var dataURL = querystring.parse(queryData).url;
    http.serveAssets(res, './public/loading.html');
  });
};


var actions = {
  'GET': getRequest,
  'POST': postRequest
};

exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if (action) {
    action(req, res);
  } else {
    http.send404(res);
  }
};
