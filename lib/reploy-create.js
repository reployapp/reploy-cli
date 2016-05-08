#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var run = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var name, result, app, platform;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(_environment.appConf.app && _environment.appConf.app.id)) {
              _context.next = 4;
              break;
            }

            console.log("You already created this app. Its id is " + _environment.appConf.app.id);
            _context.next = 16;
            break;

          case 4:
            name = _readlineSync2.default.question('Give this app a name: ');
            _context.next = 7;
            return (0, _api.query)("user { id }");

          case 7:
            result = _context.sent;
            _context.next = 10;
            return (0, _api.mutation)("createApplication", {
              name: name,
              user: result.user.id,
              createdAt: '@TIMESTAMP',
              updatedAt: '@TIMESTAMP'
            });

          case 10:
            app = _context.sent;


            _environment.appConf.app = {
              id: app.id,
              user: result.user.id
            };

            _environment.appConf.save();

            _cli2.default.info('Created app with name ' + name + ' and id ' + app.id);
            if (_readlineSync2.default.keyInYN('Do you want to build and push this project to Reploy?')) {
              platform = (0, _util.platformPrompt)();

              (0, _child_process.spawnSync)('reploy', ['push-build', '-p', platform], { stdio: 'inherit' });
            }
            console.log("To push a new build, use the 'reploy push-build' command. Type 'reploy push-build -h' for more details.");

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function run() {
    return ref.apply(this, arguments);
  };
}();

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

var _readlineSync = require('readline-sync');

var _readlineSync2 = _interopRequireDefault(_readlineSync);

var _environment = require('./environment');

var _util = require('./util');

var _api = require('./api');

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _util.checkForReact)();

run();