#!/usr/bin/env node --harmony

import program from 'commander';
import { spawnSync } from 'child_process';
import path from 'path';
import {appConf, appName} from './environment';
import api from './api';
import readlineSync from 'readline-sync';
import fs from 'fs';

program
  .option('-f, --file [file]', 'Path to graphql query file')
  .parse(process.argv);

let query = fs.readFileSync(program.file, {encoding:'utf8'});

console.log(query);

api.query(query)
.then((response) => {
console.log(response)
}).catch((error) => {
  console.log("ERROR")
  console.log(error)
})
