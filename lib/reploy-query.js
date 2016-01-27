#!/usr/bin/env node --harmony
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _environment = require('./environment');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _readlineSync = require('readline-sync');

var _readlineSync2 = _interopRequireDefault(_readlineSync);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.option('-f, --file [file]', 'Path to graphql query file').parse(process.argv);

var query = _fs2.default.readFileSync(_commander2.default.file, { encoding: 'utf8' });

console.log(query);

_api2.default.query(query).then(function (response) {
  console.log(response);
}).catch(function (error) {
  console.log("ERROR");
  console.log(error);
});