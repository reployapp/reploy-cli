#!/usr/bin/env node --harmony
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _environment = require('./environment');

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

var _tty = require('tty');

var _tty2 = _interopRequireDefault(_tty);

var _readlineSync = require('readline-sync');

var _readlineSync2 = _interopRequireDefault(_readlineSync);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!_environment.globalConf.auth) {

  var email = _readlineSync2.default.question('Enter your email address:');
  // TODO: add an 'email verification code' to login here
} else {
    _cli2.default.ok('You\'re already setup for reploy! To start over, remove the ~/' + _environment.configFilename + ' file.');
  }