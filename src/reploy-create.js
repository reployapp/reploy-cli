#!/usr/bin/env node

import cli from 'cli';
// import readlineSync from 'readline-sync';

import { appConf } from './environment';
import { checkForReact } from './util';
import { query, mutation } from './api';
import { platformPrompt } from './util';
import { spawnSync } from 'child_process';
import Random from 'random-js';

checkForReact();

async function run() {

  if (appConf.app && appConf.app.id) {
    console.log(`You already created this app with ID ${appConf.app.id}`);
  } else {
    let name = require('readline-sync').question('Give this app a name: ');
    let result = await query("user { id }");
    let urlToken = Random().string(10);
    let app = await mutation("createApplication", {
      name: name,
      user: result.user.id,
      urlToken: urlToken,
      createdAt: '@TIMESTAMP',
      updatedAt: '@TIMESTAMP',
    });

    appConf.app = {
      id: urlToken
    }

    appConf.save();

    cli.info(`Created app with name ${name} and ID ${urlToken}`);
    if (readlineSync.keyInYN('Do you want to build and push this project to Reploy?')) {
      let platform = platformPrompt();
      spawnSync('reploy', ['push-build', '-p', platform], {stdio: 'inherit'});
    }
    console.log("To push a new build, use the 'reploy push-build' command. Type 'reploy push-build -h' for more details.");
  }
}

run();
