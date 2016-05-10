#!/usr/bin/env node

import cli from 'cli';
import program from 'commander';

import { appConf } from './environment';
import { checkForReact } from './util';
import { query, mutation } from './api';
import Random from 'random-js';

program
  .option('-n, --name [name]', 'A name for this project. Required')
  .parse(process.argv);

checkForReact();

async function run() {

  if (!program.name || program.name.length == 0) {
    console.log();
    cli.error("Please name this app using the -n option.");
    program.outputHelp();
    process.exit(1);
  }

  if (appConf.app && appConf.app.id) {
    console.log(`You already created this app with ID ${appConf.app.id}`);
  } else {
    let result = await query("user { id }");
    let urlToken = Random().string(10);
    await mutation("createApplication", {
      name: program.name,
      user: result.user.id,
      urlToken: urlToken,
      createdAt: '@TIMESTAMP',
      updatedAt: '@TIMESTAMP',
    });

    appConf.app = { id: urlToken };
    appConf.save();

    cli.info(`Created app with name ${name} and ID ${urlToken}`);

    console.log("To push a new build, use the 'reploy push-build' command. Type 'reploy push-build -h' for more details.");
  }
}

run();
