#!/usr/bin/env node --harmony
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _homeConfig = require('home-config');

var _homeConfig2 = _interopRequireDefault(_homeConfig);

var _environment = require('./environment');

var _timeago = require('timeago');

var _timeago2 = _interopRequireDefault(_timeago);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!_environment.appConf.app) {

  console.log("You need to create this app first with: reploy create");
} else {

  _api2.default.get('/apps/' + _environment.appConf.app.id + '/js_versions').then(function (response) {
    response.body.map(function (version) {
      console.log(version.version_number + ' ' + version.bundle_hash + ' ' + (0, _timeago2.default)(new Date(version.created_at)));
    });
  }, function (error) {
    console.log('Error!');
    console.log(response);
  });
}