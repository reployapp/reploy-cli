#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import fs  from 'fs';
import {query, mutation, currentUser} from './api';
import {appConf, appVersion} from './environment';
import {find, filter} from 'lodash';
import homedir from 'os-homedir';
import FormData from 'form-data';
import superagent from 'superagent';
import Progress from 'progress';
import cli from 'cli';

program
  .option('-p, --platform [platform]', 'Platform: "ios" or "android"')
  .option('-s, --skip', 'Skip the bundling command - just upload the last one')
  .parse(process.argv);

async function run() {
  const jsPath = `/tmp/${appConf.app.id}.jsbundle`;
  const user = await currentUser();
  const platform = program.platform || 'ios';

  if (!program.skip) {
    console.log(`Bundling javascript for ${platform}`);
    let bundleArguments = `bundle --entry-file ./index.${platform}.js --dev false --platform ${platform} --bundle-output ${jsPath}`;
    console.log(`react-native ${bundleArguments}`);
    let bundleCommand = spawnSync('react-native', bundleArguments.split(" "));

    if (bundleCommand.stderr) {
      console.log(bundleCommand.stderr.toString());
    }
  }

  let uploadcareId = null;

  superagent.post('https://upload.uploadcare.com/base/')
    .field('UPLOADCARE_PUB_KEY', '9e1ace5cb5be7f20d38a')
    .field('UPLOADCARE_STORE', '1')
    .attach('file', jsPath)
    .on('progress', (progress) => {
      cli.progress(progress.loaded / progress.total);
    })
    .end((err, response) => {
      if (err) {
        console.log(err);
      } else {
        uploadcareId = response.body.file;
        mutation('createJSBundle', {
          uploadId: uploadcareId,
          application: appConf.app.id,
          createdAt: '@TIMESTAMP',
          platform: platform,
          user: user.id,
        });
      }
    });

}

run();
