#!/usr/bin/env node --harmony
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _environment = require('./environment');

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

var _input = require('./input');

(0, _input.readApiIdFromCLI)().then(function (apiId) {
  return (0, _input.readApiSecretFromCLI)().then(function (apiSecret) {
    return [apiId, apiSecret];
  });
}).spread(function (apiId, apiSecret) {
  _environment.globalConf.auth = { apiId: apiId, apiSecret: apiSecret };
  _environment.globalConf.save();
}).then(function () {
  _cli2['default'].ok('Saved your config to ~/.reploy');
});