#!/usr/bin/env node --harmony
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

if (!_environment.globalConf.auth) {

  var email = _readlineSync2['default'].question('Enter your email address:');
  var password = _readlineSync2['default'].question('Enter a password:', { hideEchoBack: true });

  _api2['default'].post_without_auth('/users', { email: email, password: password }).then(function (response) {
    _environment.globalConf.auth = { apiId: response.res.body.secret_id, apiSecret: response.res.body.secret };
    _environment.globalConf.save();
    _cli2['default'].ok("You're all setup! Next, register your app from within its directory with: reploy create-app");
  }, function (error) {
    console.log(error.res.body);
  });
} else {
  _cli2['default'].ok('You\'re already setup for reploy! To start over, remove the ~/' + _environment.configFilename + ' file.');
}