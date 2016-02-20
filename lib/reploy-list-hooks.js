#!/usr/bin/env node --harmony
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var run = (function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _api.query)('\n      allReindexHooks {\n        edges {\n          node {\n            id,\n            url,\n            fragment,\n            trigger\n          }\n        }\n      }\n    ');

          case 3:
            result = _context.sent;

            result.allReindexHooks.edges.forEach(function (hook) {
              console.log(hook.node);
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

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _api = require('./api');

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

run();