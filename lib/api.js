#!/usr/bin/env node --harmony
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _homeConfig = require('home-config');

var _homeConfig2 = _interopRequireDefault(_homeConfig);

var _environment = require('./environment');

module.exports = {
  request: function request() {
    return _superagent2['default'].set("X-ApiId", _environment.appConf.app.apiId).set("X-ApiSecret", _environment.appConf.app.apiSecret);
  },
  get: function get(url) {
    return this.request().get(url);
  },

  post: function post(url) {
    return this.request().post(url);
  }
};