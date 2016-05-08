#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var run = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var platform;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            platform = null;


            if (_commander2.default.platform) {
              platform = _commander2.default.platform;
            } else {
              platform = (0, _util.platformPrompt)();
            }

            if (!_commander2.default.buildPath) {
              platform === 'ios' ? buildIOS() : buildAndroid();
            }

            (0, _postBuildUpload.uploadBuild)(platform, { buildPath: _commander2.default.buildPath, applicationId: _commander2.default.applicationId });

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function run() {
    return ref.apply(this, arguments);
  };
}();

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _environment = require('./environment');

var _postBuildUpload = require('./util/postBuildUpload');

var _util = require('./util');

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.option('-p, --platform [platform]', 'Platform: "ios" or "android"').option('-s, --skip', 'Skip the build step: eiter re-upload the previous build, or upload the build file specified with -b').option('-b, --buildPath [buildPath]', 'Optional build file path for custom builds').option('-a, --applicationId [applicationId]', 'Your target application ID').option('-t, --token [token]', 'Your Reploy authentication token').parse(process.argv);

if (_commander2.default.token) {
  _api2.default.setToken(_commander2.default.token);
}

if (!_commander2.default.applicationId && !_fs2.default.existsSync(_environment.appConf.__filename)) {
  _cli2.default.error('\nCouldn\'t find the Reploy config file named .reploy at the application root.\nRun \'reploy create\' to get setup, or use the -a option to specify your ID manually. Use \'reploy list-apps\' to see your application IDs.\n');
  process.exit(1);
}

function buildIOS() {
  var xcodeProject = (0, _util.getXcodeProject)();
  var selectedSimulator = (0, _util.getDefaultSimulator)();

  var xcodebuildArgs = [xcodeProject.isWorkspace ? '-workspace' : '-project', './ios/' + xcodeProject.name, '-scheme', (0, _util.getProjectName)(), '-destination', 'id=' + selectedSimulator.udid, '-configuration', 'Release', 'CODE_SIGNING_REQUIRED=NO', 'CONFIGURATION_BUILD_DIR=/tmp/' + (0, _util.getProjectName)()];

  if (!_commander2.default.skip) {
    _cli2.default.info('Building iOS project ' + xcodeProject.name);
    _cli2.default.info('Running: xcodebuild ' + xcodebuildArgs.join(' '));
    var buildCommand = (0, _child_process.spawnSync)('xcodebuild', xcodebuildArgs, { stdio: 'inherit' });
    if (buildCommand.status != 0) {
      _cli2.default.error('Build failed: ' + buildCommand.error);
      process.exit(1);
    }
  }

  _cli2.default.info("Zipping build before upload...");
  process.chdir('/tmp/' + (0, _util.getProjectName)());
  var zip = (0, _child_process.spawnSync)('zip', ['-r', _postBuildUpload.buildPathIos, '.']);
}

function buildAndroid() {
  if (!_fs2.default.existsSync('./android')) {
    _cli2.default.error("Unable to locate the 'android' directory. Run this command from the root directory of your React Native project.");
    process.exit(1);
  }

  if (!_commander2.default.skip) {
    _cli2.default.info('Building android release...');
    process.chdir('./android');
    (0, _child_process.spawnSync)('./gradlew', ['assembleRelease'], { stdio: 'inherit' });
  } else {
    _cli2.default.info("Skipping android build...");
  }
}

run();