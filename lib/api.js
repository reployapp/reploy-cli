'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mutation = exports.query = exports.getApplication = undefined;

var _bluebird = require('bluebird');

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

if (_process2.default.env["REINDEX_ADMIN"]) {
  db.setToken(_process2.default.env["REINDEX_TOKEN"]);
} else if (_process2.default.env["REPLOY_TOKEN"]) {
  db.setToken(_process2.default.env["REPLOY_TOKEN"]);
} else {
  console.log("Please set REPLOY_TOKEN in your shell environment.");
  _process2.default.exit(1);
}

exports.default = db;

var getApplication = exports.getApplication = (function () {
  var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee(id) {
    var response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return query('{\n    getApplication(id: ' + id + ') {\n      id,\n      appetizeId\n    }\n  }');

          case 2:
            response = _context.sent;
            return _context.abrupt('return', response.data.getApplication);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function getApplication(_x) {
    return ref.apply(this, arguments);
  };
})();

var query = exports.query = (function () {
  var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2(query) {
    var result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return db.query('{viewer{' + query + '}}');

          case 3:
            result = _context2.sent;

            if (!result.errors) {
              _context2.next = 9;
              break;
            }

            console.log(result.errors);
            _process2.default.exit(1);
            _context2.next = 10;
            break;

          case 9:
            return _context2.abrupt('return', result.data.viewer);

          case 10:
            _context2.next = 16;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2['catch'](0);

            console.log(_context2.t0);
            _process2.default.exit(1);

          case 16:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 12]]);
  }));
  return function query(_x2) {
    return ref.apply(this, arguments);
  };
})();

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var mutation = exports.mutation = (function () {
  var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3(name, input) {
    var _result;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return db.query('\n      mutation ' + name + '($input: _' + capitalize(name) + 'Input!) {\n        ' + name + '(input: $input) {\n          id\n        }\n      }\n    ', { input: input });

          case 3:
            _result = _context3.sent;

            if (!_result.errors) {
              _context3.next = 9;
              break;
            }

            console.log(_result.errors);
            _process2.default.exit(1);
            _context3.next = 10;
            break;

          case 9:
            return _context3.abrupt('return', _result.data[name]);

          case 10:
            _context3.next = 16;
            break;

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3['catch'](0);

            console.log(_context3.t0);
            _process2.default.exit(1);

          case 16:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 12]]);
  }));
  return function mutation(_x3, _x4) {
    return ref.apply(this, arguments);
  };
})();