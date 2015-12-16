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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_environment.appConf.app && _environment.appConf.app.id) {

  console.log("You already created this app. Its id is " + _environment.appConf.app.id);
} else {
  (function () {

    var name = _readlineSync2.default.question('Give this app a name: ');

    _api2.default.query('\n    mutation createApp($input: _CreateApplicationInput!) {\n      createApplication(input: $input) {\n        id\n      }\n    }\n  ', { input: { name: name } }).then(function (response) {

      console.log(response);
      var appId = response.data.createApplication.id;

      _environment.appConf.app = {
        id: appId
      };

      _environment.appConf.save();

      console.log('Created app with name ' + name + ' and id ' + appId);
    }).catch(function (error) {
      console.log(error);
    });
  })();
}