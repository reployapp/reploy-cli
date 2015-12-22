'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApplication = getApplication;
exports.query = query;
exports.mutation = mutation;

var _environment = require('./environment');

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

var _reindexJs = require('reindex-js');

var _reindexJs2 = _interopRequireDefault(_reindexJs);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

require('babel-polyfill');

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
  var response;
  return regeneratorRuntime.async(function getApplication$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.next = 2;
        return regeneratorRuntime.awrap(query('{\n    getApplication(id: ' + id + ') {\n      id,\n      appetizeId\n    }\n  }'));

      case 2:
        response = _context.sent;
        return _context.abrupt('return', response.data.getApplication);

      case 4:
      case 'end':
        return _context.stop();
    }
  }, null, this);
}

function query(query) {
  var result;
  return regeneratorRuntime.async(function query$(_context2) {
    while (1) switch (_context2.prev = _context2.next) {
      case 0:
        _context2.prev = 0;
        _context2.next = 3;
        return regeneratorRuntime.awrap(db.query('{viewer{' + query + '}}'));

      case 3:
        result = _context2.sent;
        return _context2.abrupt('return', result.data.viewer);

      case 7:
        _context2.prev = 7;
        _context2.t0 = _context2['catch'](0);

        console.log(_context2.t0);
        _process2.default.exit(1);

      case 11:
      case 'end':
        return _context2.stop();
    }
  }, null, this, [[0, 7]]);
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function mutation(name, input) {
  var result;
  return regeneratorRuntime.async(function mutation$(_context3) {
    while (1) switch (_context3.prev = _context3.next) {
      case 0:
        _context3.prev = 0;
        _context3.next = 3;
        return regeneratorRuntime.awrap(db.query('\n      mutation ' + name + '($input: _' + capitalize(name) + 'Input!) {\n        ' + name + '(input: $input) {\n          id\n        }\n      }\n    ', { input: input }));

      case 3:
        result = _context3.sent;

        console.log(result.data[name]);
        return _context3.abrupt('return', result.data[name]);

      case 8:
        _context3.prev = 8;
        _context3.t0 = _context3['catch'](0);

        console.log(_context3.t0);
        _process2.default.exit(1);

      case 12:
      case 'end':
        return _context3.stop();
    }
  }, null, this, [[0, 8]]);
}