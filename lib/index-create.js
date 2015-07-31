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

var _homeConfig = require('home-config');

var _homeConfig2 = _interopRequireDefault(_homeConfig);

var appConf = _homeConfig2['default'].load(_path2['default'].join(process.cwd(), ".reploy"));

if (appConf.app && appConf.app.id) {

  console.log("You already created this app. It's id is " + appConf.app.id);
} else {

  _superagent2['default'].post('http://reploy.io/apps').end(function (err, response) {

    if (response.ok) {
      appConf.app = {
        id: response.body.id
      };
      appConf.save();
      console.log("Created app with id " + response.body.id);
    } else {
      console.log('Error!');
      console.log(response);
    }
  });
}