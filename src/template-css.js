/*
 *  Copyright 2013 Liam Goodacre
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an "AS
 *  IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *  express or implied. See the License for the specific language
 *  governing permissions and limitations under the License.
 */

/*  Imports  */
var fs = require('fs');
var path = require('path');
var _ = require('underscore')._;
var ensureDir = require('ensureDir');
var css_api = require('./css-api.js');

/*  Compiles a file using underscores template function.  */
var compileTo = function (toDir) {
  return function (fromDir, fileName) {
    var from = path.join(fromDir, fileName);
    var to = path.join(toDir, fileName);

    fs.readFile(from, function (err, contents) {
      if (err) { return console.log(err); }

      ensureDir(path.dirname(to), function (err) {
        if (err) { return console.log(err); }

        fs.createWriteStream(to).end(_.template(contents.toString(), css_api));
      });
    });
  };
};

/*    */
var eachInDir = function recur(from, callback, file) {
  file = file || '';
  var dir = path.join(from, file);

  fs.stat(dir, function (err, stat) {
    if (err) { throw err; }

    if (stat.isFile()) { return callback(from, file); }
    if (!stat.isDirectory()) { return; }

    fs.readdir(dir, function (err, files) {
      if (err) { throw err; }

      return _.each(files, function (item) {
        recur(from, callback, path.join(file, item));
      });
    });
  });
};

(function main() {

  if (process.argv.length < 4) {
    return console.log('Arguments: "from-dir" "to-dir"');
  }

  var from = process.argv[2];
  var to   = process.argv[3];

  if (!from) { return console.log('"from-dir" cannot be empty/null.'); }
  if (!to  ) { return console.log('"to-dir" cannot be empty/null.'); }

  eachInDir(from, compileTo(to));

})();
