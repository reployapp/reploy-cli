#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import fs  from 'fs';
import {mutation, query, getApplication} from './api';
import {appConf, appVersion} from './environment';
import {find, filter} from 'lodash';
import homedir from 'os-homedir';
import FormData from 'form-data';
import Progress from 'progress';
import {capitalize} from './util';

program
  .option('-p, --platform [platform]', 'Platform: "ios" or "android"')
  .parse(process.argv);

const platform = program.platform || 'ios';

const superagent = require('superagent-promise')(require('superagent'), Promise);

const buildDirIos = path.join(homedir(), '/Library/Developer/Xcode/DerivedData');
const buildPathIos = `/tmp/${projectName()}-ios.zip`;

const buildPathAndroid = path.join(process.cwd(), '/android/app/build/outputs/apk/app-debug.apk');

if (!appConf) {
  console.log('Please run first: reploy create-app');
  process.exit(1);
}

async function run() {

  if (platform == 'ios') {
    createBuildZipFile();
  }

  const buildPath = platform == 'ios' ? buildPathIos : buildPathAndroid;

  let application = await getApplication(appConf.app.id);

  try {
    let uploadId = await uploadBuild(buildPath);

    console.log('Updating build on Reploy...');
    let appetizePrivateKey = application[`appetizePrivateKey${capitalize(platform)}`];
    if (appetizePrivateKey) {
      await uploadToAppetize(uploadId, {appetizePrivateKey, platform});
    } else {
      let appetizeData = await uploadToAppetize(uploadId, {platform});
      await addAppetizeIdToReploy(appetizeData, platform);
    }

    addBuildtoReploy(uploadId);
  } catch (error) {
    console.log(error);
  }
}

async function addAppetizeIdToReploy(appetizeData, platform) {
  let data = {
    id: appConf.app.id,
  };

  data[`appetizePublicKey${capitalize(platform)}`] = appetizeData.publicKey;
  data[`appetizePrivateKey${capitalize(platform)}`] = appetizeData.privateKey;

  await mutation('updateApplication', data);
}

async function addBuildtoReploy(uploadId) {
  let response = await mutation('createBinaryUpload', {uploadId: uploadId, user: appConf.app.user, application: appConf.app.id, createdAt: '@TIMESTAMP'});
}

function projectName() {
  let files = fs.readdirSync(path.join(process.cwd(), 'ios'));

  let file = find(files, (filename) => {
    return filename.indexOf('xcodeproj') > -1;
  });

  return file.split('.')[0];
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

function createBuildZipFile() {

  if (!latestBuildPath()) {
    console.error('No builds available. Building now...');
    let build = spawnSync('xctool', ['CODE_SIGNING_REQUIRED=NO', 'CODE_SIGN_IDENTITY=', 'PROVISIONING_PROFILE=',
                          '-destination', 'platform=iOS Simulator,name=iPhone 6,OS=9.2',
                          '-sdk', 'iphonesimulator',
                          '-project', `ios/${projectName()}.xcodeproj`,
                          '-scheme', projectName(), 'build',
                        ]);
    console.log(build.stderr.toString());
    console.log(build.stdout.toString());
  }

  if (fs.existsSync(buildPathIos)) {
    fs.unlinkSync(buildPathIos);
  }

  process.chdir(`${buildDirIos}/${latestBuildPath()}/Build/Products/Debug-iphonesimulator`);
  let zip = spawnSync('zip', ['-r', buildPathIos,  '.']);
}

async function uploadBuild(filePath) {

  let bar = new Progress(':percent uploaded', { total: fs.statSync(buildPathIos).size });

  try {
    let response = await superagent.post('https://upload.uploadcare.com/base/')
      .field('UPLOADCARE_PUB_KEY', '9e1ace5cb5be7f20d38a')
      .attach('file', filePath)
      .on('progress', (progress) => {
        if (!bar.completed) {
          bar.tick(progress.loaded);
        }
      });

    return (response.body.file);

  } catch (error) {
    console.log(error);
  }
}

async function uploadToAppetize(uploadId, options = {appetizePrivateKey: null, platform: 'ios'}) {

  console.log(options);
  console.log(`Uploading to appetize for platform ${options.platform}`);
  let webtaskToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IjIifQ.eyJqdGkiOiIxYjA2NWIwNjIxNGU0M2U1YmU3MTgyYjk1MjZjNDIxNCIsImlhdCI6MTQ1MTE3NDIxOSwiZHIiOjEsImNhIjpbIjU1MTIwOGQ2YzNhODQyNDBiMzAzMjk2ZTFkYzRjOTFiIl0sImRkIjowLCJ0ZW4iOiJ3dC1qb3NodWEtZGlsdXZpYV9uZXQtMCIsImVjdHgiOiJOcUpST2htZUkydEpvaWZYRFhqdkFFZnRXaVdoUHFWYnJNd096SkpHc3p1L3Y3ZUZYaTBQdSsrUlgvUVN3Skp2TnNta1o3Zko4N2ZHSE9rQlpPenFoQT09LlZRWFVydnhtYlJ4UWZicUc3S0dscUE9PSIsImp0biI6ImNyZWF0ZU9uQXBwZXRpemUiLCJtYiI6MSwicGIiOjEsInVybCI6Imh0dHBzOi8vd2VidGFzay5pdC5hdXRoMC5jb20vYXBpL3J1bi9hdXRoMC13ZWJ0YXNrLWNvZGU_a2V5PWV5SmhiR2NpT2lKSVV6STFOaUlzSW10cFpDSTZJaklpZlEuZXlKcWRHa2lPaUpoTW1Ka016UXhaR1F4TUdJME1tVmxZV1EwTURFek9UZzJaVGsyTjJSaE1DSXNJbWxoZENJNk1UUTFNVEUzTkRJeE9Td2laSElpT2pFc0ltTmhJanBiSW1GMWRHZ3dMWGRsWW5SaGMyc3RZMjlrWlNKZExDSmtaQ0k2TUN3aWRYSnNJam9pY21WeGRXbHlaVG92TDJGMWRHZ3dMWE5oYm1SaWIzZ3RaWGgwUDJWNGNHOXlkRDF6ZEc5eVpWOWpiMlJsWDNNeklpd2lkR1Z1SWpvaVlYVjBhREF0ZDJWaWRHRnpheTFqYjJSbElpd2ljR04wZUNJNmV5SnRaWFJvYjJRaU9pSkhSVlFpTENKd1lYUm9Jam9pWTI5a1pTODFOVEV5TURoa05tTXpZVGcwTWpRd1lqTXdNekk1Tm1VeFpHTTBZemt4WWk4eU5XTmxZV0poTnpobFpqSXhOall3T0dabFpESTJOakEzTVRJeVkyTTJaQ0o5TENKbFkzUjRJam9pWjFnM1p6aHZhakZDYmxKSGNTOUxkRU5ITm1JMk9VWkdUbVZ3VlhKdVZtVnRaMHhGYTBGalZsZ3JNMXBRTkZwdlFrOVdibHBtYmxFeU0zVXJVVzVFUlVWTE5XSllNeTg0ZVZRMlRrRTBVRXg0WnpoT1NWWldjbXhSUW14RWNWVkZWaXQ2ZVZGdmJURjNlVm80ZEhOTk5WaGlhVzVFZG14VmFHNVJjM05WWkhka1ZHTk1SekkzYzI5a1dqWjJlbGxFY0RWQ1NFRldLM1oxUzJ0a2JtRlVMemwzZGxsM1pGbHdVazUwVW5nck1HeFlabmxWZERrM2JHcHBSbTVUY1V4UGJsSnpVemdyTVN0QmRrMW5lVTFYV1RSU1ZWaDBSbTFKUTIwM0wxWldVM2x2WTNOcU1FUlBWREpQV2pkeWVub3hVVlJOVGxkWVVsZGFSblJrV0VOU1pUSkRObTVxU1ZFeGR6SXZiamhwVkdaVGFUSjVTbmM5UFM1eWNraDFSVXBWV2tWd1NtcElkWEZUVlRoQmVWRkJQVDBpZlEuU3c5RURjcDRjQks1TWpMamZGVDRLS0gzZ0ZPM0c5SldhN2NnWW1scDctRSJ9.OZmIxS2XOurjwHofaTDFw_vG8gsEoxNix1U6O2wN8Jc';

  let params = {
    url: `https://ucarecdn.com/${uploadId}/file.zip`,
    platform: options.platform,
  };

  if (options.appetizePrivateKey) {
    params.privateKey = options.appetizePrivateKey;
  }

  try {
    let result = await superagent.post('https://webtask.it.auth0.com/api/run/wt-joshua-diluvia_net-0')
    .set('Authorization', `Bearer ${webtaskToken}`)
    .send({params});
    return result.body;
  } catch (error) {
    console.log(error);
  }
}

run();
