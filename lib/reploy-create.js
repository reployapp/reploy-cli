#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var run = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var result, urlToken;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:

            if (!_commander2.default.name || _commander2.default.name.length == 0) {
              console.log();
              _cli2.default.error("Please name this app using the -n option.");
              _commander2.default.outputHelp();
              _process2.default.exit(1);
            }

            if (!(_environment.appConf.app && _environment.appConf.app.id)) {
              _context.next = 5;
              break;
            }

            console.log('You already created this app with ID ' + _environment.appConf.app.id);
            _context.next = 22;
            break;

          case 5:
            _context.prev = 5;
            _context.next = 8;
            return (0, _api.query)("user { id }");

          case 8:
            result = _context.sent;
            urlToken = (0, _randomJs2.default)().string(10);
            _context.next = 12;
            return (0, _api.mutation)("createApplication", {
              name: _commander2.default.name,
              user: result.user.id,
              urlToken: urlToken,
              createdAt: '@TIMESTAMP',
              updatedAt: '@TIMESTAMP'
            });

          case 12:

            _environment.appConf.app = { id: urlToken };
            _environment.appConf.save();
            console.log(_environment.appConf);

            _cli2.default.info('Created app with name ' + _commander2.default.name + ' and ID ' + urlToken);

            console.log("To push a new build, use the 'reploy push-build' command. Type 'reploy push-build -h' for more details.");

            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context['catch'](5);

            console.log(_context.t0);

          case 22:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[5, 19]]);
  }));
  return function run() {
    return ref.apply(this, arguments);
  };
}();

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _environment = require('./environment');

var _util = require('./util');

var _api = require('./api');

var _randomJs = require('random-js');

var _randomJs2 = _interopRequireDefault(_randomJs);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.option('-n, --name [name]', 'A name for this project. Required').parse(_process2.default.argv);

(0, _util.checkForReact)();

run();