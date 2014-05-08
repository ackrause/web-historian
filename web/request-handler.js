var path = require('path');
var url = require('url');
var querystring = require('querystring');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers.js');

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
    // get url from user input
    var dataUrl = querystring.parse(queryData).url;
    // check if it is in the list
    archive.isUrlInList(dataUrl, function(isInList) {
      // if it is, then check if it is in the archives
      if (isInList) {
        archive.isUrlArchived(dataUrl, function(isArchived) {
          // if it is archived, serve it up
          if (isArchived) {
            console.log('I found it!');
            http.serveAssets(res, archive.paths['archivedSites'] + '/' + dataUrl);
          //if it isn't, serve up that loading page
          } else {
            console.log('I don\'ts have it');
            http.serveAssets(res, './public/loading.html');
          }
        });
        //http.serveAssets(res, './public/loading.html');
      // if it isn't, add it to the list
      } else {
        // add to list
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
