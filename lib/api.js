'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApplication = getApplication;

var _environment = require('./environment');

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

var _reindexJs = require('reindex-js');

var _reindexJs2 = _interopRequireDefault(_reindexJs);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: setup JWT in Reindex for new users for api authentication

// if (globalConf && globalConf.auth) {
//
//   if (!globalConf.auth.apiId) {
//     cli.error(`It looks like you're not setup yet to use Reploy. Get started with: reploy setup`);
//     process.exit();
//   }
//
//   var CREDENTIALS = {"X-ApiId": globalConf.auth.apiId, "X-ApiSecret": globalConf.auth.apiSecret}
// }

var REINDEX_DATABASE = _process2.default.env['REPLOY_ENV'] === 'development' ? "practical-improvement-29" : "practical-improvement-29";

var db = new _reindexJs2.default('https://' + REINDEX_DATABASE + '.myreindex.com');

if (_process2.default.env["REINDEX_TOKEN"]) {
  db.setToken(_process2.default.env["REINDEX_TOKEN"]);
} else {
  console.log("Please set REINDEX_TOKEN in your shell environment.");
  _process2.default.exit(1);
}

exports.default = db;
function getApplication(id) {
  db.query('{\n    getApplication(id: ' + id + ') {\n      id,\n      appetizeId\n    }\n  }').then(function (response) {
    return response.data.getApplication;
  }).catch(function (error) {
    console.log(error);
  });
}