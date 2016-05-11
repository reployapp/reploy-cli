'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mutation = exports.query = exports.currentUser = exports.getApplication = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getApplication = exports.getApplication = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var id = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var res, response;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _cli2.default.debug('getting application ' + id);
            _context.next = 3;
            return query('user { email, id }');

          case 3:
            res = _context.sent;

            console.log(res.user);
            _context.next = 7;
            return query('\n    applicationByUrlToken(urlToken: "' + (id || _environment.appConf.app.id) + '") {\n      id,\n      urlToken,\n      appetizePrivateKeyIos,\n      appetizePrivateKeyAndroid,\n      user {\n        id\n      }\n  }', { viewer: false });

          case 7:
            response = _context.sent;
            return _context.abrupt('return', response.applicationByUrlToken);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function getApplication(_x) {
    return ref.apply(this, arguments);
  };
}();

var currentUser = exports.currentUser = function () {
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
}();

var query = exports.query = function () {
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
  return function query(_x3, _x4) {
    return ref.apply(this, arguments);
  };
}();

var mutation = exports.mutation = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(name, input) {
    var result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return db.query('\n      mutation ' + name + '($input: _' + (0, _util.capitalize)(name) + 'Input!) {\n        ' + name + '(input: $input) {\n          id\n        }\n      }\n    ', { input: input });

          case 3:
            result = _context4.sent;

            if (!result.errors) {
              _context4.next = 9;
              break;
            }

            console.log(result.errors);
            _process2.default.exit(1);
            _context4.next = 10;
            break;

          case 9:
            return _context4.abrupt('return', result.data[name]);

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
  return function mutation(_x6, _x7) {
    return ref.apply(this, arguments);
  };
}();

var fixAppId = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
    var result;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!(_environment.appConf && _environment.appConf.app.id && _environment.appConf.app.id.length > 10)) {
              _context5.next = 6;
              break;
            }

            _context5.next = 3;
            return query('applicationById(id: "' + _environment.appConf.app.id + '") { urlToken }', { viewer: false });

          case 3:
            result = _context5.sent;

            _environment.appConf.app = {
              id: result.applicationById.urlToken
            };
            _environment.appConf.save();

          case 6:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return function fixAppId() {
    return ref.apply(this, arguments);
  };
}();

var _environment = require('./environment');

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

var _reindexJs = require('reindex-js');

var _reindexJs2 = _interopRequireDefault(_reindexJs);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = new _reindexJs2.default('https://' + _environment.apiEndpoint);
_cli2.default.debug('endpoint ' + _environment.apiEndpoint);
_cli2.default.debug('global token ' + _environment.globalConf.token);

if (_environment.globalConf && _environment.globalConf.token) {
  db.setToken(_environment.globalConf.token);
}
console.log(db);

exports.default = db;


fixAppId();