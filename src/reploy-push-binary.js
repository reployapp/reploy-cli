#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import fs  from 'fs';
import api from './api';
import {appConf, appVersion} from './environment';
import {find, filter} from 'lodash';
import homedir from 'os-homedir';
import FormData from 'form-data';
import superagent from 'superagent';
import Progress from 'progress';

let files = fs.readdirSync(path.join(process.cwd(), 'ios'));

let file = find(files, (filename) => {
  return filename.indexOf("xcodeproj") > -1
})

let projectName = file.split(".")[0]
console.log(projectName)

let buildDir = path.join(homedir(), '/Library/Developer/Xcode/DerivedData');

let simulatorBuildPaths = filter(fs.readdirSync(buildDir), (path) => {
  return path.indexOf(projectName) > -1
});

simulatorBuildPaths.sort(function(a, b) {
  return fs.statSync(buildDir + a).mtime.getTime() - fs.statSync(buildDir + b).mtime.getTime();
});

let latestPath = simulatorBuildPaths[0];
let zipFile = `/tmp/${projectName}.zip`;
fs.unlinkSync(zipFile)
process.chdir(`${buildDir}/${latestPath}/Build/Products/Debug-iphonesimulator`);
let zip = spawnSync('zip', ['-r', zipFile,  '.'])
console.log(zip.stdout.toString())

let uploadcareId = null;

let bar = new Progress(':percent uploaded', { total: fs.statSync(zipFile).size });

superagent.post('https://upload.uploadcare.com/base/')
  .field("UPLOADCARE_PUB_KEY", '9e1ace5cb5be7f20d38a')
  .attach('file', zipFile)
  .on('progress', (progress) => {

    if (!bar.complete) {
      bar.tick(progress.loaded)
    } else {
      console.log("Waiting for upload to be processed...")
    }

  })
  .end((err, response) => {
    if (err) {
      console.log(err);
    } else {
      uploadcareId = response.body.file;
      console.log(uploadcareId);
      api.query(`
        mutation createBinaryUpload($input: _CreateBinaryUploadInput!) {
          createBinaryUpload(input: $input) {
            id
          }
        }
      `, {input: {uploadId: uploadcareId, application: appConf.app.id}})
      .then((response) => {
        console.log("Binary uploaded!")
      }).catch((error) => {
        console.log(error);
      })
    }
  })
