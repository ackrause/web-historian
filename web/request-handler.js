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
    var dataUrl = querystring.parse(queryData).url;
    archive.isUrlInList(dataUrl, function(isInList) {
      if (isInList) {
        http.serveAssets(res, './public/loading.html');
      } else {
        // add to list
        archive.addUrlToList(dataUrl);
        http.serveAssets(res, './public/loading.html');
        // http.serveAssets(res, archive.paths['archivedSites'] + dataURL);
      }
    });
    http.serveAssets(res, './public/loading.html');

    // if (!archive.isUrlInList(dataUrl)) {
    //   archive.addUrlToList(dataUrl);
    //   http.serveAssets(res, './public/loading.html');
    // } else if (archive.isUrlInArchive(dataUrl)) {
    //   // show archived page
    //   http.serveAssets(res, archive.paths['archivedSites'] + dataURL);
    // } else {
    //   // Url is in list but has not been archived yet
    //   // so show loading page
    //   http.serveAssets(res, './public/loading.html');
    // }
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
