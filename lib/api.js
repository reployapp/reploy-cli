'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mutation = exports.query = exports.currentUser = exports.getApplication = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getApplication = exports.getApplication = (function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(id) {
    var response;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return query('\n    applicationById(id: "' + id + '") {\n      id,\n      appetizePrivateKeyIos,\n      appetizePrivateKeyAndroid\n  }', { viewer: false });

          case 2:
            response = _context.sent;
            return _context.abrupt('return', response.applicationById);

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

var currentUser = exports.currentUser = (function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    var response;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return query('user { id }');

          case 2:
            response = _context2.sent;
            return _context2.abrupt('return', response.user);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function currentUser() {
    return ref.apply(this, arguments);
  };
})();

var query = exports.query = (function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(query) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? { viewer: true } : arguments[1];
    var builtQuery, result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            builtQuery = options.viewer ? '{viewer{' + query + '}}' : '{' + query + '}';
            _context3.prev = 1;
            _context3.next = 4;
            return db.query(builtQuery);

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
    }, _callee3, this, [[1, 13]]);
  }));
  return function query(_x2, _x3) {
    return ref.apply(this, arguments);
  };
})();

var mutation = exports.mutation = (function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(name, input) {
    var _result;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return db.query('\n      mutation ' + name + '($input: _' + (0, _util.capitalize)(name) + 'Input!) {\n        ' + name + '(input: $input) {\n          id\n        }\n      }\n    ', { input: input });

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
    }, _callee4, this, [[0, 12]]);
  }));
  return function mutation(_x5, _x6) {
    return ref.apply(this, arguments);
  };
})();

var _environment = require('./environment');

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

var _reindexJs = require('reindex-js');

var _reindexJs2 = _interopRequireDefault(_reindexJs);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_process2.default.env.REPLOY_ENV === 'development') {
  var REINDEX_DATABASE = 'molecular-ununpentium-702';
  var REINDEX_TOKEN = _process2.default.env.REINDEX_TOKEN_DEV;
} else {
  var REINDEX_DATABASE = 'practical-improvement-29';
  var REINDEX_TOKEN = _process2.default.env.REINDEX_TOKEN_PROD;
}

var db = new _reindexJs2.default('https://' + REINDEX_DATABASE + '.myreindex.com');
var TOKEN = _process2.default.env.REPLOY_ADMIN ? REINDEX_TOKEN : _process2.default.env.REPLOY_TOKEN;

if (!TOKEN) {
  console.log('Please set REPLOY_TOKEN in your shell environment. You\'ll find that token in your Settings page: https://app.reploy.io/settings.');
  _process2.default.exit(1);
}

db.setToken(TOKEN);

exports.default = db;