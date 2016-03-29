#!/usr/bin/env node

import program from 'commander';
import homedir from 'os-homedir';

import path from 'path';
import fs  from 'fs';

import { appConf } from './environment';
import { capitalize, getDefaultSimulator, getXcodeProject } from './util';
import parseCommandLine from './util/parseCommandLine';

import { find, filter } from 'lodash';
import { getProjectName, platformPrompt } from './util';
import { buildPathAndroid, buildPathIos, uploadBuild } from './util/postBuildUpload';

import { spawnSync } from 'child_process';

program
  .option('-p, --platform [platform]', 'Platform: "ios" or "android"')
  .option('-s, --skip', 'Skip the build step - just zip and upload the previous build')
  .parse(process.argv);

const platform = program.platform || 'ios';

const superagent = require('superagent-promise')(require('superagent'), Promise);

if (!fs.existsSync(appConf.__filename)) {
  console.log(`\nCouldn't find the Reploy config file named .reploy at the application root.\nDid you run 'reploy create'?\n`);
  process.exit(1);
}

async function run() {

  if (platform == 'ios') {
    buildIOS();
  } else {
    buildAndroid();
  }
  uploadBuild(platform);
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
    console.log('Building project...');
    let buildCommand = spawnSync('xcodebuild', xcodebuildArgs, {stdio: 'inherit'});
    if (buildCommand.status != 0) {
      console.log(`Build failed: ${buildCommand.error}`);
      process.exit(1);
    }
  }

  console.log("Zipping build before upload...")
  process.chdir(`/tmp/${getProjectName()}`);
  let zip = spawnSync('zip', ['-r', buildPathIos,  '.']);
}

function buildAndroid() {
  if (!program.skip) {
    console.log('Building android release...');
    process.chdir('./android');
    spawnSync('./gradlew', ['assembleRelease'], {stdio: 'inherit'});
  } else {
    console.log("Skipping android build...");
  }
}

run();
