#!/usr/bin/env node --harmony
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _environment = require('./environment');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

if (_environment.appConf.app && _environment.appConf.app.id) {

  console.log("You already created this app. It's id is " + _environment.appConf.app.id);
} else {

  _api2['default'].post('/apps', { name: _environment.appName }).then(function (response) {

    _environment.appConf.app = {
      id: response.body.id,
      apiId: response.body.api_id,
      apiSecret: response.body.api_secret
    };
    _environment.appConf.save();
    console.log('Created app with name ' + _environment.appName + ' and id ' + response.body.id);
  }, function (response) {
    console.log('Error!');
    console.log(response.res.error);
  });
}