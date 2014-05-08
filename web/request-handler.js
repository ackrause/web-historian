var path = require('path');
var url = require('url');
var querystring = require('querystring');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers.js');
var Q = require('q');

var getRequest = function(req, res) {
  var urlPath = url.parse(req.url).pathname;

  if (urlPath === '/') {
    http.serveAssets(res, './public/index.html');
  } else if ((urlPath === '/styles.css') || (urlPath === '/public/styles.css')) {
    http.serveAssets(res, './public/styles.css');
  } else {
    http.send404(res);
  }
};

var postRequest = function(req, res) {

  // get the user input
  var queryData = '';
  req.on('data', function(partialData) {
    queryData += partialData;
  });

  req.on('end', function() {
    var dataUrl = querystring.parse(queryData).url;
    archive.isUrlInList(dataUrl)
    .then(function(isInList) {
      if (isInList) {
        archive.isUrlArchived(dataUrl)
        .then(function(isArchived) {
          if (isArchived) {
            console.log('found it');
            http.serveAssets(res, archive.paths['archivedSites'] + '/' + dataUrl);
          } else {
            console.log('not here');
            http.serveAssets(res, './public/loading.html');
          }
        });
      } else {
        archive.addUrlToList(dataUrl);
        http.serveAssets(res, './public/loading.html');
      }
    });
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
