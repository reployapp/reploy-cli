#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var run = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var platform, githubApiPrefix;
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

            _context.next = 5;
            return (0, _postBuildUpload.uploadBuild)(platform, { buildPath: _commander2.default.buildPath, applicationId: _commander2.default.applicationId, name: _commander2.default.name, url: _commander2.default.buildUrl });

          case 5:
            if (!(_commander2.default.commitHash || _commander2.default.githubToken || _commander2.default.repositoryName)) {
              _context.next = 20;
              break;
            }

            if (!(_commander2.default.commitHash && _commander2.default.githubToken && _commander2.default.repositoryName)) {
              _context.next = 19;
              break;
            }

            githubApiPrefix = _commander2.default.githubApiPrefix || "https://api.github.com";
            _context.prev = 8;
            _context.next = 11;
            return _api.request.post(githubApiPrefix + '/repos/' + _commander2.default.repositoryName + '/statuses/' + _commander2.default.commitHash + '?access_token=' + _commander2.default.githubToken).send({
              "state": "success",
              "target_url": 'https://app.reploy.io/apps/' + (_commander2.default.applicationId || _environment.appConf.app.id) + '/test/' + _commander2.default.name,
              "description": "Test this build on Reploy.",
              "context": "ci/reploy"
            });

          case 11:
            _cli2.default.ok('Updated Github status for commit ' + _commander2.default.commitHash + ' on ' + _commander2.default.repositoryName + '.');

            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context['catch'](8);

            _cli2.default.error(_context.t0);

          case 17:
            _context.next = 20;
            break;

          case 19:
            _cli2.default.error("To post a build URL to Github, please specify all of these flags: -c, -r, -g and -n");

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[8, 14]]);
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

_commander2.default.option('-p, --platform [platform]', 'Platform: "ios" or "android". REQUIRED.').option('-a, --applicationId [applicationId]', 'Your application ID on Reploy. Use \'reploy list-apps\' to get it.').option('-t, --token [token]', 'Your Reploy authentication token.').option('-b, --buildPath [buildPath]', 'Optional build file path for custom builds.').option('-s, --skip', 'Skip the automated build step. Either re-upload the previous build, or upload the build file specified by -b.').option('-n, --name [name]', 'Name this build - i.e.: PR-201, v1.0, a3dffc.').option('-g, --github-token [githubToken]', 'Github token for adding a link to the Reploy build. Use only with -c.').option('-c, --commit-hash [commitHash]', 'Git commit hash whose status should be updated with the build Reploy URL.').option('-r, --repository-name [repositoryName]', 'Github repository name, i.e.: rnplay/rnplay-native.').option('-u, --build-url [buildUrl]', 'URL to link to from the Reploy build screen.').option('-i, --github-api-prefix [githubApiPrefix]', 'Github API URL prefix for Github Enterprise users. Default: https://api.github.com.').parse(process.argv);

if (!_commander2.default.platform || _commander2.default.platform.length == 0) {
  console.log();
  _cli2.default.error("Please specify 'ios' or 'android' with the -p option.");
  _commander2.default.outputHelp();
}

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
  (0, _child_process.spawnSync)('zip', ['-r', _postBuildUpload.buildPathIos, '.']);
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