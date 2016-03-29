#!/usr/bin/env node

import program from 'commander';
import homedir from 'os-homedir';

import path from 'path';
import fs  from 'fs';
import cli from 'cli';

import { appConf } from './environment';
import { capitalize, getDefaultSimulator, getXcodeProject } from './util';
import parseCommandLine from './util/parseCommandLine';

import { find, filter } from 'lodash';
import { getProjectName, platformPrompt } from './util';
import { buildPathAndroid, buildPathIos, uploadBuild } from './util/postBuildUpload';

import { spawnSync } from 'child_process';

program
  .option('-p, --platform [platform]', 'Platform: "ios" or "android"')
  .option('-s, --skip', 'Skip the build step: eiter re-upload the previous build, or upload the build file specified with -b')
  .option('-b, --buildPath [buildPath]', 'Optional build file path for custom builds')
  .parse(process.argv);

const superagent = require('superagent-promise')(require('superagent'), Promise);

if (!fs.existsSync(appConf.__filename)) {
  cli.error(`\nCouldn't find the Reploy config file named .reploy at the application root.\nDid you run 'reploy create'?\n`);
  process.exit(1);
}

async function run() {

  let platform = null;

  if (!program.platform) {
    platform = platformPrompt();
  }

  if (platform == 'ios') {
    buildIOS();
  } else {
    buildAndroid();
  }
  uploadBuild(platform, {buildPath: program.buildPath});
}

function buildIOS() {
  let xcodeProject = getXcodeProject();
  let selectedSimulator = getDefaultSimulator();

  const xcodebuildArgs = [
    xcodeProject.isWorkspace ? '-workspace' : '-project', `./ios/${xcodeProject.name}`,
    '-scheme', getProjectName(),
    '-destination', `id=${selectedSimulator.udid}`,
    '-configuration', 'Release',
    'CODE_SIGNING_REQUIRED=NO',
    'CONFIGURATION_BUILD_DIR=/tmp/' + getProjectName(),
  ];

  if (!program.skip) {
    cli.info(`Building iOS project ${xcodeProject.name}`);
    cli.info(`Running: xcodebuild ${xcodebuildArgs.join(' ')}`);
    let buildCommand = spawnSync('xcodebuild', xcodebuildArgs, {stdio: 'inherit'});
    if (buildCommand.status != 0) {
      cli.error(`Build failed: ${buildCommand.error}`);
      process.exit(1);
    }
  }

  cli.info("Zipping build before upload...");
  process.chdir(`/tmp/${getProjectName()}`);
  let zip = spawnSync('zip', ['-r', buildPathIos,  '.']);
}

function buildAndroid() {
  if (!program.skip) {
    cli.info('Building android release...');
    process.chdir('./android');
    spawnSync('./gradlew', ['assembleRelease'], {stdio: 'inherit'});
  } else {
    cli.info("Skipping android build...");
  }
}

run();
