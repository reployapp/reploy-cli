#!/usr/bin/env node --harmony
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _homeConfig = require('home-config');

var _homeConfig2 = _interopRequireDefault(_homeConfig);

var _timeago = require('timeago');

var _timeago2 = _interopRequireDefault(_timeago);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

_api2['default'].get('/apps').then(function (response) {
  response.body.apps.map(function (app) {
    console.log(app.unique_id + ' ' + app.name + ' ' + (0, _timeago2['default'])(new Date(app.created_at)));
  });
}, function (response) {
  console.log(response.res.error);
});