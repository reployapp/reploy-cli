#!/usr/bin/env node --harmony

import cli from 'cli';
import readlineSync from 'readline-sync';

import { appConf } from './environment';
import { checkForReact } from './util';
import { query, mutation } from './api';
import { platformPrompt } from './util';
import { spawnSync } from 'child_process';

checkForReact();

async function run() {

  if (appConf.app && appConf.app.id) {
    console.log("You already created this app. Its id is " + appConf.app.id);
  } else {
    let name = readlineSync.question('Give this app a name: ');
    let result = await query("user { id }");
    let app = await mutation("createApplication", {
      name: name,
      user: result.user.id,
      createdAt: '@TIMESTAMP',
      updatedAt: '@TIMESTAMP',
    });

    appConf.app = {
      id: app.id,
      user: result.user.id
    }

    appConf.save();

    cli.info(`Created app with name ${name} and id ${app.id}`);
    if (readlineSync.keyInYN('Do you want to build and push this project to Reploy?')) {
      let platform = platformPrompt();
      spawnSync('reploy', ['push-build', '-p', platform], {stdio: 'inherit'});
    }
    console.log("To push a new build, use the 'reploy push-build' command. Type 'reploy push-build -h' for more details.");
  }
}

run();
