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

var _ = require('underscore')._;

var __prefix = ['-webkit-', '-moz-', '-ms-', '-o-', ''];

/*  Reformats a string such as: 'borderWidth' into 'border-width'  */
var __formatKey = function (key) {
  var result = key.replace(/[A-Z]/g, function (v) {
    return '-' + v.toLowerCase();
  });
  var prefix = result[0] === '_';
  result = prefix ? result.slice(1) : result;
  return (
    ( !prefix ? [result]
    : __prefix.map(function (k) {
        return k + result;
      } ))
  );
};

/*  Renders a collection of objects as css properties  */
var use = function () {
  var result = [];
  _.each(arguments, function (data) {
    _.each(data, function (value, key) {
      result = result.concat(__formatKey(key).map(function (k) {
        return k + ': ' + value + ';';
      }));
    }, this);
  }, this);
  return result.join('\n');
};

/*  Merges a collection of objects into one new object  */
var all = function () { return _.partial(_.extend, {}).apply(_, arguments); };

var __findStr = function (paths) {
  return _.map(paths, function (path) {
    return path.join(' ');
  }).join(',\n');
};

var __find = function recur(xs, ys) {
  return _.flatten(_.map(ys, function (y) {
    return _.map(xs, function (x) {
      return [y].concat(x); }); }), true);
};

var find = function () {
  return __findStr(_.foldr(arguments, __find));
};

var prop = function (k) {
  return function (v) {
    var result = {};
    result[k] = v;
    return result;
  };
};

var builder = function (str) { return function () {
  return str + '(' + _.toArray(arguments).join(',') + ')';
}; };

module.exports = {
  use : use,
  all : all,
  prop: prop,
  find: find,
  rgb : builder('rgb'),
  rgba: builder('rgba'),
  hsl : builder('hsl'),
  hsla: builder('hsla')
};
