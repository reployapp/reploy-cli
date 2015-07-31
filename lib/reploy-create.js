#!/usr/bin/env node --harmony
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _environment = require('./environment');

if (_environment.appConf.app && _environment.appConf.app.id) {

  console.log("You already created this app. It's id is " + _environment.appConf.app.id);
} else {

  _superagent2['default'].post('http://reploy.io/apps').send({ name: _environment.appName }).end(function (err, response) {

    if (response.ok) {
      _environment.appConf.app = {
        id: response.body.id
      };
      _environment.appConf.save();
      console.log('Created app with name ' + _environment.appName + ' and id ' + response.body.id);
    } else {
      console.log('Error!');
      console.log(response);
    }
  });
}