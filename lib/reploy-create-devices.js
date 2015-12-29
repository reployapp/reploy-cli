#!/usr/bin/env node --harmony
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEVICES = undefined;

var _bluebird = require('bluebird');

var _api = require('./api');

require('babel-polyfill');

var DEVICES = exports.DEVICES = [{ make: 'iphone4s', platform: 'ios', os: '8.4', label: 'iPhone4s - 8.4', width: 320, height: 480 }, { make: 'iphone4s', platform: 'ios', os: '9.0', label: 'iPhone4s - 9.0', width: 320, height: 480 }, { make: 'iphone5s', platform: 'ios', os: '8.4', label: 'iPhone5s - 8.4', width: 320, height: 568 }, { make: 'iphone5s', platform: 'ios', os: '9.0', label: 'iPhone5s - 9.0', width: 320, height: 568 }, { make: 'iphone6', platform: 'ios', os: '8.4', label: 'iPhone6 - 8.4', width: 375, height: 627 }, { make: 'iphone6', platform: 'ios', os: '9.0', label: 'iPhone6 - 9.0', width: 375, height: 627 }, { make: 'iphone6plus', platform: 'ios', os: '8.4', label: 'iPhone6+ - 8.4', width: 414, height: 736 }, { make: 'iphone6plus', platform: 'ios', os: '9.0', label: 'iPhone6+ - 9.0', width: 414, height: 736 }, { make: 'iphone6s', platform: 'ios', os: '9.0', label: 'iPhone6s - 9.0', width: 375, height: 627 }, { make: 'iphone6splus', platform: 'ios', os: '9.0', label: 'iPhone6s - 9.0', width: 414, height: 736 }, { make: 'ipadair', platform: 'ios', os: '8.4', label: 'iPad Air - 8.4', width: 768, height: 1024 }, { make: 'ipadair', platform: 'ios', os: '9.0', label: 'iPad Air - 9.0', width: 768, height: 1024 }, { make: 'ipadair2', platform: 'ios', os: '9.0', label: 'iPad Air 2 - 9.0', width: 768, height: 1024 }, { make: 'nexus5', platform: 'android', os: '4.4', label: 'Nexus 5 - 4.4', width: 360, height: 640 }, { make: 'nexus5', platform: 'android', os: '5.1', label: 'Nexus 5 - 5.1', width: 360, height: 640 }, { make: 'nexus5', platform: 'android', os: '6.0', label: 'Nexus 5 - 6.0', width: 360, height: 640 }, { make: 'nexus7', platform: 'android', os: '4.4', label: 'Nexus 7 - 4.4', width: 600, height: 960 }, { make: 'nexus7', platform: 'android', os: '5.1', label: 'Nexus 7 - 5.1', width: 600, height: 960 }, { make: 'nexus7', platform: 'android', os: '6.0', label: 'Nexus 7 - 6.0', width: 600, height: 960 }, { make: 'nexus9', platform: 'android', os: '4.4', label: 'Nexus 9 - 4.4', width: 768, height: 1024 }, { make: 'nexus9', platform: 'android', os: '5.1', label: 'Nexus 9 - 5.1', width: 768, height: 1024 }, { make: 'nexus9', platform: 'android', os: '6.0', label: 'Nexus  9 - 6.0', width: 768, height: 1024 }];

var deleteAllDevices = (function () {
  var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee() {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _api.query)('\n      allDevices(first: 100) {\n        nodes {\n          id,\n        }\n      }\n    ');

          case 3:
            result = _context.sent;

            result.allDevices.nodes.forEach(function (device) {
              (0, _api.mutation)('deleteDevice', { id: device.id });
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
  return function deleteAllDevices() {
    return ref.apply(this, arguments);
  };
})();

var createDevice = (function () {
  var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2(device, index) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _api.mutation)('createDevice', {
              order: index,
              label: device.label,
              make: device.make,
              os: device.os,
              platform: device.platform,
              width: device.width,
              height: device.height,
              createdAt: '@TIMESTAMP',
              updatedAt: '@TIMESTAMP'
            });

          case 2:
            return _context2.abrupt('return', _context2.sent);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function createDevice(_x, _x2) {
    return ref.apply(this, arguments);
  };
})();

var run = (function () {
  var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3() {
    var deleteEntires, createEntries;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            console.log('Deleting data...');
            _context3.next = 4;
            return deleteAllDevices();

          case 4:
            deleteEntires = _context3.sent;

            console.log('Done!');
            console.log('Creating new entries...');
            _context3.next = 9;
            return Promise.all(DEVICES.map(createDevice));

          case 9:
            createEntries = _context3.sent;

            console.log('Done!');
            _context3.next = 16;
            break;

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3['catch'](0);

            console.error(_context3.t0);

          case 16:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 13]]);
  }));
  return function run() {
    return ref.apply(this, arguments);
  };
})();

run();