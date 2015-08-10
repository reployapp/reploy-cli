'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _environment = require('./environment');

var _superagentBluebirdPromise = require('superagent-bluebird-promise');

var _superagentBluebirdPromise2 = _interopRequireDefault(_superagentBluebirdPromise);

var CREDENTIALS = { "X-ApiId": _environment.globalConf.apiId, "X-ApiSecret": _environment.globalConf.apiSecret };
var BASE_URL = process.env['REPLOY_ENV'] === 'development' ? "http://localhost:5544/api/v1" : "http://reploy.io/api/v1";

if (!_environment.globalConf.apiId) {
  console.log('It looks like you\'re not setup yet to use Reploy. Sign up at http://reploy.io or place your API configuration in ~/' + configFileame + '.!');
  process.exit();
}

module.exports = {
  get: function get(path) {
    return _superagentBluebirdPromise2['default'].get('' + BASE_URL + path).set(CREDENTIALS);
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