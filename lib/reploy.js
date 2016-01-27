#!/usr/bin/env node --harmony
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version('0.1.0').command('setup', 'Configure credentials for the Reploy API').command('list-apps', 'List javascript bundle versions').command('create-app', 'Create this app on Reploy').command('push-binary', 'Push an application binary').command('push-binary-android', 'Push an Android application binary').command('push-js', 'Build and push a javascript bundle').command('list-js', 'List javascript bundle versions').command('query', 'Run a graphql query from a file').command('delete-all', 'Delete all data!').command('list-hooks', 'List Reindex webhooks').command('create-devices', 'Create devices').parse(process.argv);