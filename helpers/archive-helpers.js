var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpRequest = require('http-request');
var Q = require('q');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(){
  var deferred = Q.defer();
  fs.readFile(this.paths.list, function(err, data) {
    if (err) { deferred.reject(new Error(err)); }
    else {
      deferred.resolve(data.toString().split('\n'));
    }
  });
  return deferred.promise;
};

exports.isUrlInList = function(url){
  return this.readListOfUrls().then(function(urlArray) {
    return urlArray.indexOf(url) > -1;
  }, function(err) {
    console.log(err);
  });
};

exports.addUrlToList = function(dataUrl){
  var deferred = Q.defer();
  fs.appendFile(this.paths.list, dataUrl + '\n', function(err) {
    if (err) { deferred.reject(new Error(err)); }
  });
  return deferred.promise;
};

exports.isUrlArchived = function(filename){
  var deferred = Q.defer();
  fs.exists(this.paths.archivedSites + '/' + filename, function(exists) {
    deferred.resolve({exists: exists, url: filename});
  });
  return deferred.promise;
};

exports.downloadUrls = function(){
  // read the list of URLS
  return this.readListOfUrls()
  .then(function(urlArray) {
    // for each URL
    for (var i = 0; i < urlArray.length; i++) {
      // check if URL is archived
      exports.isUrlArchived(urlArray[i])
      .then(function(result) {
        // download if not archived
        if (!result.exists) {
          return Q.nfcall(httpRequest.get, result.url, exports.paths.archivedSites+'/'+result.url);
        }
      });
    }
  });
};
