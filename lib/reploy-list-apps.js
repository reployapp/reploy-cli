#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var run = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var result, applications;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _api.query)('\n      user {\n        applications {\n          count,\n          nodes {\n            id,\n            urlToken,\n            name,\n            screenshots {\n              count,\n            }\n            invitedUsers {\n              count\n            }\n            binaryUploads(last: 1) {\n              nodes {\n               versionCode\n              }\n            }\n          }\n        }\n      }');

          case 3:
            result = _context.sent;
            applications = result.user.applications;


            if (applications.count === 0) {
              console.log('Uh oh! No applications found. \nPlease make sure you\'ve created an app and that your accounts token is set in /~.reploy');
            } else {
              applications.nodes.forEach(function (app) {
                table.push([app.urlToken, app.name, app.screenshots.count, app.invitedUsers.count, app.binaryUploads.nodes[0].versionCode]);
              });
              console.log(table.toString());
            }
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
    }, _callee, this, [[0, 8]]);
  }));
  return function run() {
    return ref.apply(this, arguments);
  };
}();

var _api = require('./api');

var _cliTable = require('cli-table');

var _cliTable2 = _interopRequireDefault(_cliTable);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = new _cliTable2.default({
  head: [_colors2.default.cyan('ID'), _colors2.default.cyan('Name'), _colors2.default.cyan('Screenshots'), _colors2.default.cyan('Testers'), _colors2.default.cyan('Version')],
  colWidths: [50, 20, 15, 10, 10]
});

run();