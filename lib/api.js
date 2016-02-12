'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApplication = getApplication;
exports.currentUser = currentUser;
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

var _util = require('./util');

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

var REINDEX_DATABASE = _process2.default.env['REPLOY_ENV'] === 'development' ? "molecular-ununpentium-702" : "molecular-ununpentium-702";

var db = new _reindexJs2.default('https://' + REINDEX_DATABASE + '.myreindex.com');

if (_process2.default.env["REINDEX_ADMIN"]) {
  db.setToken(_process2.default.env["REINDEX_TOKEN"]);
} else if (_process2.default.env["REPLOY_TOKEN"]) {
  db.setToken(_process2.default.env["REPLOY_TOKEN"]);
} else {
  console.log("Please set REPLOY_TOKEN in your shell environment.");
  _process2.default.exit(1);
}

exports.default = db;
function getApplication(id) {
  var response;
  return regeneratorRuntime.async(function getApplication$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(query('\n    applicationById(id: "' + id + '") {\n      id,\n      appetizePrivateKeyIos,\n      appetizePrivateKeyAndroid\n  }', { viewer: false }));

        case 2:
          response = _context.sent;
          return _context.abrupt('return', response.applicationById);

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

function currentUser() {
  var response;
  return regeneratorRuntime.async(function currentUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(query('user { id }'));

        case 2:
          response = _context2.sent;
          return _context2.abrupt('return', response.user);

        case 4:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
}

function query(query) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? { viewer: true } : arguments[1];
  var builtQuery, result;
  return regeneratorRuntime.async(function query$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          builtQuery = options.viewer ? '{viewer{' + query + '}}' : '{' + query + '}';
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(db.query(builtQuery));

        case 4:
          result = _context3.sent;

          if (!result.errors) {
            _context3.next = 10;
            break;
          }

          console.log(result.errors);
          _process2.default.exit(1);
          _context3.next = 11;
          break;

        case 10:
          return _context3.abrupt('return', options.viewer ? result.data.viewer : result.data);

        case 11:
          _context3.next = 17;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3['catch'](1);

          console.log(_context3.t0);
          _process2.default.exit(1);

        case 17:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this, [[1, 13]]);
}

function mutation(name, input) {
  var _result;

  return regeneratorRuntime.async(function mutation$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(db.query('\n      mutation ' + name + '($input: _' + (0, _util.capitalize)(name) + 'Input!) {\n        ' + name + '(input: $input) {\n          id\n        }\n      }\n    ', { input: input }));

        case 3:
          _result = _context4.sent;

          if (!_result.errors) {
            _context4.next = 9;
            break;
          }

          console.log(_result.errors);
          _process2.default.exit(1);
          _context4.next = 10;
          break;

        case 9:
          return _context4.abrupt('return', _result.data[name]);

        case 10:
          _context4.next = 16;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4['catch'](0);

          console.log(_context4.t0);
          _process2.default.exit(1);

        case 16:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, this, [[0, 12]]);
}