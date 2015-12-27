#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import fs  from 'fs';
import api, {getApplication} from './api';
import {appConf, appVersion} from './environment';
import {find, filter} from 'lodash';
import FormData from 'form-data';
import superagent from 'superagent-bluebird-promise';
import Progress from 'progress';
import 'babel-polyfill';

const buildDir = path.join(process.cwd(), '/android/app/build/outputs/apk/');
const zipFile = `/tmp/${projectName()}-android.zip`;

if (!appConf) {
  console.log("Please run first: reploy create-app");
  process.exit(1);
}

// console.log('buildDIr', buildDir);
console.log('project Name', projectName());
console.log('latestAPKBuild', latestAPKBuild());
uploadBuild();


// const uploadId = uploadBuild((uploadId) => {
//   createOnAppetize(uploadId, (response) => {
//     api.query(`
//       mutation updateApplication($input: _UpdateApplicationInput!) {
//         updateApplication(input: $input) {
//           id
//         }
//       }
//     `, {input: {id: appConf.app.id, appetizePublicKey: response.publicKey, appetizePrivateKey: response.privateKey}})
//     .then((response) => {
//         addBuildtoReploy(uploadId)
//     });
//   });
// });


function addBuildtoReploy(uploadId) {
  console.log("Updating build on Reploy...")

  api.query(`
    mutation createBinaryUpload($input: _CreateBinaryUploadInput!) {
      createBinaryUpload(input: $input) {
        id
      }
    }
  `, {input: {uploadId: uploadId, application: appConf.app.id, createdAt: "@TIMESTAMP"}})
  .then((response) => {
    console.log("Done!")
  }).catch((error) => {
    console.log(error);
  })
}

function projectName() {
  let projectName = (fs.readFileSync(`${process.cwd()}/android/settings.gradle`, 'utf8').toString().match(/rootProject\.name\s*=\s*['|"](.*)['|"]/));
  if (projectName) {
    return projectName[1];
  } else {
    console.log('Error: Unable to locate project name.')
  }
}

function latestAPKBuild() {

  let latestBuild = fs.readdirSync(buildDir).filter(function(file) {
    return file.substr(-4) === '.apk';
  }).sort(function(a, b) {
    return fs.statSync(`${buildDir}/${b}`).mtime.getTime() - fs.statSync(`${buildDir}/${a}`).mtime.getTime();
  });

  if (latestBuild) {
    return latestBuild[0];
  } else {
    return null;
  }
}

async function uploadBuild(callback) {
  try {
    let file = buildDir + latestAPKBuild();
    let bar = new Progress(':percent uploaded', { total: fs.statSync(file).size });

    let response = await superagent.post('https://upload.uploadcare.com/base/')
    .field("UPLOADCARE_PUB_KEY", '9e1ace5cb5be7f20d38a')
    .attach('file', file)
    .on('progress', (progress) => {
      if (!bar.completed) {
        bar.tick(progress.loaded)
      }
    });
    return reponse;
  } catch (error) {
    console.error(error);
  }
}

function createOnAppetize(uploadId, callback) {
  console.log("Creating on appetize...")
  superagent.post('https://webtask.it.auth0.com/api/run/wt-joshua-diluvia_net-0')
    .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjIifQ.eyJqdGkiOiI5YzliOWVhOGUxNzQ0OWRmYTk2ZTA2YTNlMzkxZGRmNSIsImlhdCI6MTQ1MDI5MDY3MCwiZHIiOjEsImNhIjpbIjU1MTIwOGQ2YzNhODQyNDBiMzAzMjk2ZTFkYzRjOTFiIl0sImRkIjowLCJ0ZW4iOiJ3dC1qb3NodWEtZGlsdXZpYV9uZXQtMCIsImVjdHgiOiJZRUpEd1BlZnFaVDNXcEVtL0NBMHVETDdEV3ZkS1dkckZ6b09UcGVkelVYNEVjb0p3b2I4V010QVJ3VWNubFZVcmhEc2p3aGUzYzVnL0g5a25CeEx1dz09LlRIc2hKbDBmQVNGdXVqK3cwOW1sakE9PSIsImp0biI6ImNyZWF0ZU9uQXBwZXRpemUiLCJtYiI6MSwicGIiOjEsInVybCI6Imh0dHBzOi8vd2VidGFzay5pdC5hdXRoMC5jb20vYXBpL3J1bi9hdXRoMC13ZWJ0YXNrLWNvZGU_a2V5PWV5SmhiR2NpT2lKSVV6STFOaUlzSW10cFpDSTZJaklpZlEuZXlKcWRHa2lPaUl6TkRWaU1HUTNNalpsTXpnMFlUVTVZak0wWlRSbU5EZGhNRFZoTXprNVl5SXNJbWxoZENJNk1UUTFNREk1TURZM01Dd2laSElpT2pFc0ltTmhJanBiSW1GMWRHZ3dMWGRsWW5SaGMyc3RZMjlrWlNKZExDSmtaQ0k2TUN3aWRYSnNJam9pY21WeGRXbHlaVG92TDJGMWRHZ3dMWE5oYm1SaWIzZ3RaWGgwUDJWNGNHOXlkRDF6ZEc5eVpWOWpiMlJsWDNNeklpd2lkR1Z1SWpvaVlYVjBhREF0ZDJWaWRHRnpheTFqYjJSbElpd2ljR04wZUNJNmV5SnRaWFJvYjJRaU9pSkhSVlFpTENKd1lYUm9Jam9pWTI5a1pTODFOVEV5TURoa05tTXpZVGcwTWpRd1lqTXdNekk1Tm1VeFpHTTBZemt4WWk4ek16YzBOakE1WWpNelpqWXhOVGhqWXpoaE5Ua3dNekV5TVRVek5ERTNPQ0o5TENKbFkzUjRJam9pUkRsamJWRnVUM1JaVURCNFVUTk5UMlJsTVdKeFpWVXhlbGgwSzJGQ1EyazBTWGhPU2pOcGNFZDFNMnhKU21sS1JHZ3pWWFpuV1U1MU1sazNXRkpJTld3dmFUQkJOa2gwYjNkSGRTOXVObGRHV2xSck0wMWhOa2MyVVRRMmJESjJSSFJzTTB3NFdYVkJaVVZIVTJWSFRFcGllbmR0VmpCQlJscEhaWFUyUzBWcVIybEVZekJRY20xa1VtUlBiWFZ5UTBweWQwVXJWMjlhUkRKU09GWllkRkJaVWtjdk5sZzBWRnAyV1RCR1NFdFdiSE5PV0c0MGFGSkJZVFJ0SzJKUmRqbFlaRTVaTUU1dU5FZzBhSEUwU0VKSllVbFNOV1J3VlZGTk4zSkdTR3RuV2tJclJWUjNUMWRvYnpWb1ZVdE1lRWR0TjNjNFpUQnRkbUZ4WVU1bU4yeDRkbE4zZUdSUGEyRlBWelJGVG1sV1pFSlRRM2M5UFM1blF5OVZWRTV1Y25Sc1dIZGtZUzlhYkVKd2VUTlJQVDBpZlEuRUxwQVczWmQ4dVNyQzlXY2EwYXpkUms4dlZDc0UyWXJ2Vk92dUMySHo2dyJ9.u-ZBcycHoVlwjaZqg7XPvuK2BU8zlXJZ6qgvQAbco2s")
    .send({uploadId: uploadId})
    .end((err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Created!")
        callback(response.body.file);
      }
    })
}
