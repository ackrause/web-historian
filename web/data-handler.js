var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers.js');
var Q = require('q');
var _ = require('underscore');

exports.returnListOfUrls = function(response) {
  archive.readListOfUrls()
    .then(function(urlArray) {
      http.sendResponse(response, {urls: urlArray});
    });
};

exports.handleUrl = function(request, response) {
  exports.returnListOfUrls(response);
};
