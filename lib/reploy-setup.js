#!/usr/bin/env node
'use strict';

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

var _readlineSync = require('readline-sync');

var _readlineSync2 = _interopRequireDefault(_readlineSync);

var _environment = require('./environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!_environment.globalConf.token) {
  var token = _readlineSync2.default.question('Enter your API token from https://app.reploy.io/settings: ');
  _environment.globalConf.token = token;
  _environment.globalConf.save();
} else {
  _cli2.default.info('You\'re already setup for reploy! Need to reset your token?. Remove the file at ~/' + _environment.globalConf.__filename + ' and run this command again.');
}