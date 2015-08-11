'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _environment = require('./environment');

var _superagentBluebirdPromise = require('superagent-bluebird-promise');

var _superagentBluebirdPromise2 = _interopRequireDefault(_superagentBluebirdPromise);

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

if (_environment.globalConf && _environment.globalConf.auth) {

  if (!_environment.globalConf.auth.apiId) {
    _cli2['default'].error('It looks like you\'re not setup yet to use Reploy. Get started with: reploy setup');
    process.exit();
  }

  var CREDENTIALS = { "X-ApiId": _environment.globalConf.auth.apiId, "X-ApiSecret": _environment.globalConf.auth.apiSecret };
}

var BASE_URL = process.env['REPLOY_ENV'] === 'development' ? "http://localhost:5544/api/v1" : "https://reploy.io/api/v1";

module.exports = {
  get: function get(path) {
    return _superagentBluebirdPromise2['default'].get('' + BASE_URL + path).set(CREDENTIALS);
  },
  post_without_auth: function post_without_auth(path, params) {
    return _superagentBluebirdPromise2['default'].post('' + BASE_URL + path).send(params);
  },
  post: function post(path, params) {
    var req = _superagentBluebirdPromise2['default'].post('' + BASE_URL + path).set(CREDENTIALS);

    if (params.attachments) {
      params.attachments.forEach(function (attachment) {
        req.attach(attachment.field, attachment.path);
      });
      return req;
    } else {
      return req.send(params);
    }
  },
  put: function put(path) {
    return _superagentBluebirdPromise2['default'].put('' + BASE_URL + path).set(CREDENTIALS);
  },
  'delete': function _delete(path) {
    return _superagentBluebirdPromise2['default']['delete']('' + BASE_URL + path).set(CREDENTIALS);
  }
};