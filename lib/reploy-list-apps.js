#!/usr/bin/env node --harmony
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _homeConfig = require('home-config');

var _homeConfig2 = _interopRequireDefault(_homeConfig);

var _environment = require('./environment');

var _timeago = require('timeago');

var _timeago2 = _interopRequireDefault(_timeago);

if (!_environment.globalConf.apiId) {
  console.log(_environment.globalConf);
  console.log("No configuration found at ~/.reploy. Maybe you need to sign up at http://reploy.io first!");
} else {

  _superagent2['default'].get('http://reploy.io/api/v1/apps').set("X-ApiId", _environment.globalConf.apiId).set("X-ApiSecret", _environment.globalConf.apiSecret).end(function (err, response) {

    if (response.ok) {
      response.body.apps.map(function (app) {
        console.log(app.name + ' ' + (0, _timeago2['default'])(new Date(app.created_at)));
      });
    } else {
      console.log('Error!');
      console.log(response);
    }
  });
}