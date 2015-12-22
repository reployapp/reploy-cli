#!/usr/bin/env node --harmony
'use strict';

var _bluebird = require('bluebird');

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _api = require('./api');

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var run = (function () {
  var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee() {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _api.query)('\n        user {\n          applications {\n            edges {\n              node {\n                name\n              }\n            }\n          }\n        }');

          case 3:
            result = _context.sent;

            result.user.applications.edges.forEach(function (app) {
              console.log(app.node.name);
            });
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](0);

            console.log(_context.t0);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 7]]);
  }));
  return function run() {
    return ref.apply(this, arguments);
  };
})();

run();