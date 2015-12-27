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
const superagent = require('superagent-promise')(require('superagent'), Promise);

const buildDir = path.join(homedir(), '/Library/Developer/Xcode/DerivedData');
const zipFile = `/tmp/${projectName()}.zip`;

if (!appConf) {
  console.log("Please run first: reploy create-app");
  process.exit(1);
}

async function run() {
  createBuildZipFile();

  let application = await getApplication(appConf.app.id);

  try {
    let uploadId = await uploadBuild();

    if (application.appetizePrivateKeyIos) {
      await uploadToAppetize(uploadId, application.appetizePrivateKeyIos);
    } else {
      let appetizeData = await uploadToAppetize(uploadId);
      await addAppetizeIdToReploy(appetizeData);
    }

    console.log("Updating build on Reploy...")
    addBuildtoReploy(uploadId);
  } catch (error) {
    console.log(error);
  }
}

async function addAppetizeIdToReploy(appetizeData) {
  await mutation('updateApplication',
    { id: appConf.app.id,
      appetizePublicKeyIos: appetizeData.publicKey,
      appetizePrivateKeyIos: appetizeData.privateKey})
}

async function addBuildtoReploy(uploadId) {
  let response = await mutation("createBinaryUpload", {uploadId: uploadId, user: appConf.app.user, application: appConf.app.id, createdAt: "@TIMESTAMP"})
}

function projectName() {
  let files = fs.readdirSync(path.join(process.cwd(), 'ios'));

  let file = find(files, (filename) => {
    return filename.indexOf("xcodeproj") > -1
  })

  return file.split(".")[0]
}

function latestBuildPath() {

  let simulatorBuildPaths = filter(fs.readdirSync(buildDir), (path) => {
    return path.indexOf(projectName()) > -1
  });

  if (simulatorBuildPaths.length == 0) {
    return null;
  }

  simulatorBuildPaths.sort(function(a, b) {
    return fs.statSync(`${buildDir}/${b}`).mtime.getTime() - fs.statSync(`${buildDir}/${a}`).mtime.getTime();
  });

  return simulatorBuildPaths[0];
}

function createBuildZipFile() {

  if (!latestBuildPath()) {
    console.error("No builds available. Building now...")
    let build = spawnSync("xctool", ["CODE_SIGNING_REQUIRED=NO", "CODE_SIGN_IDENTITY=", "PROVISIONING_PROFILE=",
                          "-destination", "platform=iOS Simulator,name=iPhone 6,OS=9.2",
                          "-sdk", "iphonesimulator",
                          "-project", `ios/${projectName()}.xcodeproj`,
                          "-scheme", projectName(),
                          "build"])
    console.log(build.stderr.toString())
    console.log(build.stdout.toString())
  }

  if (fs.existsSync(zipFile)) {
    fs.unlinkSync(zipFile)
  }
  console.log(latestBuildPath())
  process.chdir(`${buildDir}/${latestBuildPath()}/Build/Products/Debug-iphonesimulator`);
  let zip = spawnSync('zip', ['-r', zipFile,  '.'])
}

async function uploadBuild() {

  let bar = new Progress(':percent uploaded', { total: fs.statSync(zipFile).size });

  try {
    let response = await superagent.post('https://upload.uploadcare.com/base/')
      .field("UPLOADCARE_PUB_KEY", '9e1ace5cb5be7f20d38a')
      .attach('file', zipFile)
      .on('progress', (progress) => {
        if (!bar.completed) {
          bar.tick(progress.loaded)
        }
      })

      return(response.body.file);

  } catch (error) {
    console.log(error);
  }
}

async function uploadToAppetize(uploadId, appetizePrivateKey = null) {

  let webtaskToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjIifQ.eyJqdGkiOiIxYjA2NWIwNjIxNGU0M2U1YmU3MTgyYjk1MjZjNDIxNCIsImlhdCI6MTQ1MTE3NDIxOSwiZHIiOjEsImNhIjpbIjU1MTIwOGQ2YzNhODQyNDBiMzAzMjk2ZTFkYzRjOTFiIl0sImRkIjowLCJ0ZW4iOiJ3dC1qb3NodWEtZGlsdXZpYV9uZXQtMCIsImVjdHgiOiJOcUpST2htZUkydEpvaWZYRFhqdkFFZnRXaVdoUHFWYnJNd096SkpHc3p1L3Y3ZUZYaTBQdSsrUlgvUVN3Skp2TnNta1o3Zko4N2ZHSE9rQlpPenFoQT09LlZRWFVydnhtYlJ4UWZicUc3S0dscUE9PSIsImp0biI6ImNyZWF0ZU9uQXBwZXRpemUiLCJtYiI6MSwicGIiOjEsInVybCI6Imh0dHBzOi8vd2VidGFzay5pdC5hdXRoMC5jb20vYXBpL3J1bi9hdXRoMC13ZWJ0YXNrLWNvZGU_a2V5PWV5SmhiR2NpT2lKSVV6STFOaUlzSW10cFpDSTZJaklpZlEuZXlKcWRHa2lPaUpoTW1Ka016UXhaR1F4TUdJME1tVmxZV1EwTURFek9UZzJaVGsyTjJSaE1DSXNJbWxoZENJNk1UUTFNVEUzTkRJeE9Td2laSElpT2pFc0ltTmhJanBiSW1GMWRHZ3dMWGRsWW5SaGMyc3RZMjlrWlNKZExDSmtaQ0k2TUN3aWRYSnNJam9pY21WeGRXbHlaVG92TDJGMWRHZ3dMWE5oYm1SaWIzZ3RaWGgwUDJWNGNHOXlkRDF6ZEc5eVpWOWpiMlJsWDNNeklpd2lkR1Z1SWpvaVlYVjBhREF0ZDJWaWRHRnpheTFqYjJSbElpd2ljR04wZUNJNmV5SnRaWFJvYjJRaU9pSkhSVlFpTENKd1lYUm9Jam9pWTI5a1pTODFOVEV5TURoa05tTXpZVGcwTWpRd1lqTXdNekk1Tm1VeFpHTTBZemt4WWk4eU5XTmxZV0poTnpobFpqSXhOall3T0dabFpESTJOakEzTVRJeVkyTTJaQ0o5TENKbFkzUjRJam9pWjFnM1p6aHZhakZDYmxKSGNTOUxkRU5ITm1JMk9VWkdUbVZ3VlhKdVZtVnRaMHhGYTBGalZsZ3JNMXBRTkZwdlFrOVdibHBtYmxFeU0zVXJVVzVFUlVWTE5XSllNeTg0ZVZRMlRrRTBVRXg0WnpoT1NWWldjbXhSUW14RWNWVkZWaXQ2ZVZGdmJURjNlVm80ZEhOTk5WaGlhVzVFZG14VmFHNVJjM05WWkhka1ZHTk1SekkzYzI5a1dqWjJlbGxFY0RWQ1NFRldLM1oxUzJ0a2JtRlVMemwzZGxsM1pGbHdVazUwVW5nck1HeFlabmxWZERrM2JHcHBSbTVUY1V4UGJsSnpVemdyTVN0QmRrMW5lVTFYV1RSU1ZWaDBSbTFKUTIwM0wxWldVM2x2WTNOcU1FUlBWREpQV2pkeWVub3hVVlJOVGxkWVVsZGFSblJrV0VOU1pUSkRObTVxU1ZFeGR6SXZiamhwVkdaVGFUSjVTbmM5UFM1eWNraDFSVXBWV2tWd1NtcElkWEZUVlRoQmVWRkJQVDBpZlEuU3c5RURjcDRjQks1TWpMamZGVDRLS0gzZ0ZPM0c5SldhN2NnWW1scDctRSJ9.OZmIxS2XOurjwHofaTDFw_vG8gsEoxNix1U6O2wN8Jc";

  let params = {
    url: `https://ucarecdn.com/${uploadId}/file.zip`,
    platform: "ios"
  }

  if (appetizePrivateKey) {
    params['appetizePrivateKey'] = appetizePrivateKey
  }

  try {
    let result = await superagent.post('https://webtask.it.auth0.com/api/run/wt-joshua-diluvia_net-0')
    .set("Authorization", `Bearer ${webtaskToken}`)
    .send({params});
    return result.body;
  } catch (error) {
    console.log(error)
  }
}

run();
