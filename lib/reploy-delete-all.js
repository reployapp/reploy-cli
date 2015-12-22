#!/usr/bin/env node --harmony
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _environment = require('./environment');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function run() {
  var result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, type, results, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, node;

  return regeneratorRuntime.async(function run$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.prev = 0;
        _context.next = 3;
        return regeneratorRuntime.awrap(_api2.default.query('{\n      viewer {\n        allReindexTypes {\n          nodes {\n            name\n          }\n        }\n      }\n    }\n    '));

      case 3:
        result = _context.sent;
        _iteratorNormalCompletion = true;
        _didIteratorError = false;
        _iteratorError = undefined;
        _context.prev = 7;
        _iterator = result.data.viewer.allReindexTypes.nodes[Symbol.iterator]();

      case 9:
        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
          _context.next = 38;
          break;
        }

        type = _step.value;

        console.log(type.name);
        _context.next = 14;
        return regeneratorRuntime.awrap(_api2.default.query('{\n        viewer {\n          allUsers {\n            nodes {\n              id\n            }\n          }\n        }\n      }'));

      case 14:
        results = _context.sent;

        if (!results.data.viewer['all' + type.name + 's']) {
          _context.next = 35;
          break;
        }

        _iteratorNormalCompletion2 = true;
        _didIteratorError2 = false;
        _iteratorError2 = undefined;
        _context.prev = 19;

        for (_iterator2 = results.data.viewer['all' + type.name + 's'].nodes[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          node = _step2.value;

          _api2.default.query('\n            mutation deleteNode($input: _Delete' + type + 'Input!) {\n              deleteApplication(input: $input) {\n                id\n              }\n            }\n          ', { input: { id: node.id } });
        }
        _context.next = 27;
        break;

      case 23:
        _context.prev = 23;
        _context.t0 = _context['catch'](19);
        _didIteratorError2 = true;
        _iteratorError2 = _context.t0;

      case 27:
        _context.prev = 27;
        _context.prev = 28;

        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }

      case 30:
        _context.prev = 30;

        if (!_didIteratorError2) {
          _context.next = 33;
          break;
        }

        throw _iteratorError2;

      case 33:
        return _context.finish(30);

      case 34:
        return _context.finish(27);

      case 35:
        _iteratorNormalCompletion = true;
        _context.next = 9;
        break;

      case 38:
        _context.next = 44;
        break;

      case 40:
        _context.prev = 40;
        _context.t1 = _context['catch'](7);
        _didIteratorError = true;
        _iteratorError = _context.t1;

      case 44:
        _context.prev = 44;
        _context.prev = 45;

        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }

      case 47:
        _context.prev = 47;

        if (!_didIteratorError) {
          _context.next = 50;
          break;
        }

        throw _iteratorError;

      case 50:
        return _context.finish(47);

      case 51:
        return _context.finish(44);

      case 52:
        _context.next = 57;
        break;

      case 54:
        _context.prev = 54;
        _context.t2 = _context['catch'](0);

        console.error(_context.t2);

      case 57:
      case 'end':
        return _context.stop();
    }
  }, null, this, [[0, 54], [7, 40, 44, 52], [19, 23, 27, 35], [28,, 30, 34], [45,, 47, 51]]);
}

run();