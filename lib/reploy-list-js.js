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

if (!_environment.appConf.app) {

  console.log("You need to create this app first with: reploy create");
} else {

  _superagent2['default'].get('http://localhost:9393/api/v1/apps/' + _environment.appConf.app.id + '/' + _environment.appVersion + '/js_versions').set("X-ApiId", _environment.appConf.app.apiId).set("X-ApiSecret", _environment.appConf.app.apiSecret).end(function (err, response) {

    if (response.ok) {
      response.body.map(function (version) {
        console.log(version.bundle_hash + ' ' + (0, _timeago2['default'])(new Date(version.created_at)));
      });
    } else {
      console.log('Error!');
      console.log(response);
    }
  });
}