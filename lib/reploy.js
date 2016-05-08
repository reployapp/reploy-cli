#!/usr/bin/env node
'use strict';

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _updateNotifier = require('update-notifier');

var _updateNotifier2 = _interopRequireDefault(_updateNotifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var notifier = (0, _updateNotifier2.default)({ pkg: _package2.default, lastUpdateCheck: 0, updateCheckInterval: 1000 });
notifier.notify({ defer: false });

var app = _commander2.default.version(_package2.default.version).command('setup', 'Configure your Reploy credentials available at https://app.reploy.io/settings').command('list-apps', 'List javascript bundle versions').command('create', 'Add a React Native app').command('push-build', 'Push an iOS or Android build');

app.parse(process.argv);

var commandExists = app.commands.some(function (cmd) {
  return cmd._name == app.args[0];
});

if (app.args[0] && !commandExists) {
  console.log();
  _cli2.default.error('That\'s not a command!');
  app.outputHelp();
};