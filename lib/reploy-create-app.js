#!/usr/bin/env node --harmony
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var run = (function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var name, result, app;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(_environment.appConf.app && _environment.appConf.app.id)) {
              _context.next = 4;
              break;
            }

            console.log("You already created this app. Its id is " + _environment.appConf.app.id);

            _context.next = 15;
            break;

          case 4:
            name = _readlineSync2.default.question('Give this app a name: ');
            _context.next = 7;
            return (0, _api.query)("user { id }");

          case 7:
            result = _context.sent;

            console.log(result.user.id);
            _context.next = 11;
            return (0, _api.mutation)("createApplication", {
              name: name,
              user: result.user.id,
              createdAt: '@TIMESTAMP',
              updatedAt: '@TIMESTAMP'
            });

          case 11:
            app = _context.sent;

            _environment.appConf.app = {
              id: app.id,
              user: result.user.id
            };

            _environment.appConf.save();

            console.log('Created app with name ' + name + ' and id ' + app.id);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function run() {
    return ref.apply(this, arguments);
  };
})();

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _environment = require('./environment');

var _api = require('./api');

var _readlineSync = require('readline-sync');

var _readlineSync2 = _interopRequireDefault(_readlineSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

run();