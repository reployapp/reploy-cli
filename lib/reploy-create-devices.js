#!/usr/bin/env node --harmony
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEVICES = undefined;

var _api = require('./api');

require('babel-polyfill');

var DEVICES = exports.DEVICES = [{ make: 'iphone4s', platform: 'ios', os: '8.4', label: 'iPhone4s - 8.4', width: 320, height: 480, defaultScale: "75" }, { make: 'iphone4s', platform: 'ios', os: '9.0', label: 'iPhone4s - 9.0', width: 320, height: 480, defaultScale: "75" }, { make: 'iphone5s', platform: 'ios', os: '8.4', label: 'iPhone5s - 8.4', width: 320, height: 568 }, { make: 'iphone5s', platform: 'ios', os: '9.0', label: 'iPhone5s - 9.0', width: 320, height: 568 }, { make: 'iphone6', platform: 'ios', os: '8.4', label: 'iPhone6 - 8.4', width: 375, height: 627 }, { make: 'iphone6', platform: 'ios', os: '9.0', label: 'iPhone6 - 9.0', width: 375, height: 627 }, { make: 'iphone6plus', platform: 'ios', os: '8.4', label: 'iPhone6+ - 8.4', width: 621, height: 1104 }, { make: 'iphone6plus', platform: 'ios', os: '9.0', label: 'iPhone6+ - 9.0', width: 621, height: 1104 }, { make: 'iphone6s', platform: 'ios', os: '9.0', label: 'iPhone6s - 9.0', width: 375, height: 627, default: true }, { make: 'iphone6splus', platform: 'ios', os: '9.0', label: 'iPhone6s - 9.0', width: 621, height: 1104 }, { make: 'ipadair', platform: 'ios', os: '8.4', label: 'iPad Air - 8.4', width: 768, height: 1024 }, { make: 'ipadair', platform: 'ios', os: '9.0', label: 'iPad Air - 9.0', width: 768, height: 1024 }, { make: 'ipadair2', platform: 'ios', os: '9.0', label: 'iPad Air 2 - 9.0', width: 768, height: 1024 }, { make: 'nexus5', platform: 'android', os: '4.4', label: 'Nexus 5 - 4.4', width: 360, height: 640 }, { make: 'nexus5', platform: 'android', os: '5.1', label: 'Nexus 5 - 5.1', width: 360, height: 640 }, { make: 'nexus5', platform: 'android', os: '6.0', label: 'Nexus 5 - 6.0', width: 360, height: 640 }, { make: 'hammerhead', platform: 'android', os: '5.1.1', label: 'Real Nexus 5 - 6.0', width: 540, height: 960 }, { make: 'nexus7', platform: 'android', os: '4.4', label: 'Nexus 7 - 4.4', width: 600, height: 960 }, { make: 'nexus7', platform: 'android', os: '5.1', label: 'Nexus 7 - 5.1', width: 600, height: 960 }, { make: 'nexus7', platform: 'android', os: '6.0', label: 'Nexus 7 - 6.0', width: 600, height: 960 }, { make: 'nexus9', platform: 'android', os: '4.4', label: 'Nexus 9 - 4.4', width: 768, height: 1024 }, { make: 'nexus9', platform: 'android', os: '5.1', label: 'Nexus 9 - 5.1', width: 768, height: 1024 }, { make: 'nexus9', platform: 'android', os: '6.0', label: 'Nexus  9 - 6.0', width: 768, height: 1024 }];

function deleteAllDevices() {
  var result;
  return regeneratorRuntime.async(function deleteAllDevices$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _api.query)('\n      allDevices(first: 100) {\n        nodes {\n          id,\n        }\n      }\n    '));

        case 3:
          result = _context.sent;

          console.log(result.allDevices);
          result.allDevices.nodes.forEach(function (device) {
            (0, _api.mutation)('deleteDevice', { id: device.id });
          });
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context['catch'](0);

          console.log(_context.t0);

        case 11:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[0, 8]]);
}

function createDevice(device, index) {
  return regeneratorRuntime.async(function createDevice$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap((0, _api.mutation)('createDevice', {
            order: index,
            label: device.label,
            make: device.make,
            os: device.os,
            platform: device.platform,
            width: device.width,
            height: device.height,
            createdAt: '@TIMESTAMP',
            updatedAt: '@TIMESTAMP'
          }));

        case 2:
          return _context2.abrupt('return', _context2.sent);

        case 3:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
}

function run() {
  var deleteEntires, createEntries;
  return regeneratorRuntime.async(function run$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;

          console.log('Deleting data...');
          _context3.next = 4;
          return regeneratorRuntime.awrap(deleteAllDevices());

        case 4:
          deleteEntires = _context3.sent;

          console.log('Done!');
          console.log('Creating new entries...');

          _context3.next = 9;
          return regeneratorRuntime.awrap(Promise.all(DEVICES.map(createDevice)));

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
  }, null, this, [[0, 13]]);
}

run();