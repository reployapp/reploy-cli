#!/usr/bin/env node

import program from 'commander';
import homedir from 'os-homedir';

import cli from 'cli';
import path from 'path';
import fs  from 'fs';

import { appConf, appVersion} from './environment';
import { capitalize } from './util';
import { find, filter } from 'lodash';
import { getApplication, query, mutation } from './api';
import { platformPrompt } from './util';
import { spawnSync } from 'child_process';

program
  .option('-p, --platform [platform]', 'Platform: "ios" or "android"')
  .option('-s, --skip', 'Skip the build step - just zip and upload the previous build')
  .parse(process.argv);

const platform = program.platform || platformPrompt();

const superagent = require('superagent-promise')(require('superagent'), Promise);

const buildDirIos = path.join(homedir(), '/Library/Developer/Xcode/DerivedData');
const buildPathIos = `/tmp/${projectName()}-ios.zip`;

const buildPathAndroid = path.join(process.cwd(), '/android/app/build/outputs/apk/app-release.apk');


if (!fs.existsSync(appConf.__filename)) {
  console.log(`\nCouldn't find the Reploy config file named .reploy at the application root.\nDid you run 'reploy create'?\n`);
  process.exit(1);
}

async function run() {
  if (platform == 'ios') {
    createBuildZipFile();
  } else {
    buildAndroid();
  }

  const buildPath = platform == 'ios' ? buildPathIos : buildPathAndroid;

  let application = await getApplication(appConf.app.id);

  try {

    let uploadId = await uploadBuild(buildPath);
    let appetizeData = null;

    console.log(`Uploading ${platform} build to Reploy...`);
    let appetizePrivateKey = application[`appetizePrivateKey${capitalize(platform)}`];
    if (appetizePrivateKey) {
      appetizeData = await uploadToAppetize(uploadId, {appetizePrivateKey, platform});
    } else {
      appetizeData = await uploadToAppetize(uploadId, {platform});
      await addAppetizeIdToReploy(appetizeData, platform);
    }

    addBuildtoReploy(uploadId, appetizeData, platform);
  } catch (error) {
    console.log(error);
  }
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

async function addAppetizeIdToReploy(appetizeData, platform) {
  let data = {
    id: appConf.app.id,
  };

  console.log(appetizeData);
  data[`appetizePublicKey${capitalize(platform)}`] = appetizeData.publicKey;
  data[`appetizePrivateKey${capitalize(platform)}`] = appetizeData.privateKey;

  await mutation('updateApplication', data);
}

async function addBuildtoReploy(uploadId, appetizeData, platform) {
  let response = await mutation('createBinaryUpload', {
    uploadId: uploadId,
    user: appConf.app.user,
    platform: platform,
    application: appConf.app.id,
    versionCode: appetizeData.versionCode,
    createdAt: '@TIMESTAMP',
  });
}

function findFileIn(name, path) {
  let files = fs.readdirSync(path);

  let file = find(files, (filename) => {
    return filename.indexOf(name) > -1;
  });

  return file ? `${path}/${file}` : null;
}

function projectName() {
  let file = iosProjectFile();
  let segments = file.split('/');
  return segments[segments.length - 1].split('.')[0];
}

function latestBuildPath() {

  let simulatorBuildPaths = filter(fs.readdirSync(buildDirIos), (path) => {
    return path.indexOf(projectName()) > -1;
  });

  if (simulatorBuildPaths.length == 0) {
    return null;
  }

  simulatorBuildPaths.sort(function(a, b) {
    return fs.statSync(`${buildDirIos}/${b}`).mtime.getTime() - fs.statSync(`${buildDirIos}/${a}`).mtime.getTime();
  });

  return simulatorBuildPaths[0];
}

function iosProjectFile() {
  let file = null;

  file = findFileIn('xcodeproj', path.join(process.cwd(), 'ios'));

  if (!file) {
    file = findFileIn('xcodeproj', process.cwd());
  }
  return file;
}

function createBuildZipFile() {

  spawnSync('mkdir', ['-p', `/tmp/${projectName()}.xcode`]);

  let buildArguments = `CODE_SIGNING_REQUIRED=NO
CODE_SIGN_IDENTITY=
PROVISIONING_PROFILE=
CONFIGURATION_BUILD_DIR=/tmp/${projectName()}.xcode
-destination
platform=iOS Simulator,name=iPhone 6,OS=9.2
-sdk
iphonesimulator
-configuration
Release
-project
${iosProjectFile()}
-scheme
${projectName()}
build`;


  if (!program.skip) {
    console.log('Building project...');
    let buildArray = buildArguments.split('\n');
    let buildCommand = spawnSync('xctool', buildArray, {stdio: 'inherit'});
    if (buildCommand.status != 0) {
      console.log(`Build failed: ${buildCommand.error}`);
      process.exit(1);
    }
  }

  console.log("Zipping build before upload...")
  process.chdir(`/tmp/${projectName()}.xcode`);
  let zip = spawnSync('zip', ['-r', buildPathIos,  '.']);
}

async function uploadBuild(filePath) {

  console.log(`Uploading build from ${filePath}...`)
  let size = fs.statSync(filePath).size;

  try {
    let response = await superagent.post('https://upload.uploadcare.com/base/')
      .field('UPLOADCARE_PUB_KEY', '9e1ace5cb5be7f20d38a')
      .attach('file', filePath)
      .on('progress', (progress) => {
        cli.progress(progress.loaded / progress.total);
      });

    return (response.body.file);

  } catch (error) {
    console.log(error);
  }
}

async function uploadToAppetize(uploadId, options = {appetizePrivateKey: null, platform: 'ios'}) {

  console.log(`Finalizing upload for platform ${options.platform}`);

  let params = {
    url: `https://ucarecdn.com/${uploadId}/file.zip`,
    platform: options.platform,
  };

  if (options.appetizePrivateKey) {
    params.privateKey = options.appetizePrivateKey;
  }

  try {
    let result = await superagent.post('https://webtask.it.auth0.com/api/run/wt-joshua-diluvia_net-0/createOnAppetize')
    .send({params});
    return result.body;
  } catch (error) {
    console.log(error);
  }
}

run();
