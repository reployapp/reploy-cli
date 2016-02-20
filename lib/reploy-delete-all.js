#!/usr/bin/env node --harmony
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var run = (function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, type, results, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, node, _result;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _api.query)('\n        allReindexTypes {\n          nodes {\n            name\n          }\n        }\n    ', { viewer: true });

          case 3:
            result = _context.sent;

            console.log(result.allReindexTypes.nodes);
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 8;
            _iterator = (0, _getIterator3.default)(result.allReindexTypes.nodes);

          case 10:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 48;
              break;
            }

            type = _step.value;

            console.log(type);
            _context.next = 15;
            return (0, _api.query)('\n          all' + type.name + 's {\n            nodes {\n              id\n            }\n          }', { viewer: true });

          case 15:
            results = _context.sent;

            if (!results['all' + type.name + 's']) {
              _context.next = 45;
              break;
            }

            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 20;
            _iterator2 = (0, _getIterator3.default)(results['all' + type.name + 's'].nodes);

          case 22:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context.next = 31;
              break;
            }

            node = _step2.value;
            _context.next = 26;
            return (0, _api.mutation)('delete' + type.name, { id: node.id });

          case 26:
            _result = _context.sent;

            console.log(_result);

          case 28:
            _iteratorNormalCompletion2 = true;
            _context.next = 22;
            break;

          case 31:
            _context.next = 37;
            break;

          case 33:
            _context.prev = 33;
            _context.t0 = _context['catch'](20);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t0;

          case 37:
            _context.prev = 37;
            _context.prev = 38;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 40:
            _context.prev = 40;

            if (!_didIteratorError2) {
              _context.next = 43;
              break;
            }

            throw _iteratorError2;

          case 43:
            return _context.finish(40);

          case 44:
            return _context.finish(37);

          case 45:
            _iteratorNormalCompletion = true;
            _context.next = 10;
            break;

          case 48:
            _context.next = 54;
            break;

          case 50:
            _context.prev = 50;
            _context.t1 = _context['catch'](8);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 54:
            _context.prev = 54;
            _context.prev = 55;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 57:
            _context.prev = 57;

            if (!_didIteratorError) {
              _context.next = 60;
              break;
            }

            throw _iteratorError;

          case 60:
            return _context.finish(57);

          case 61:
            return _context.finish(54);

          case 62:
            _context.next = 67;
            break;

          case 64:
            _context.prev = 64;
            _context.t2 = _context['catch'](0);

            console.error(_context.t2);

          case 67:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 64], [8, 50, 54, 62], [20, 33, 37, 45], [38,, 40, 44], [55,, 57, 61]]);
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

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

run();