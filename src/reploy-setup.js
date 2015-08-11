#!/usr/bin/env node --harmony

import program from 'commander';
import {globalConf} from './environment';
import cli from 'cli';

import {
  readApiIdFromCLI,
  readApiSecretFromCLI
} from './input';


readApiIdFromCLI()
  .then((apiId) => {
    return readApiSecretFromCLI()
      .then((apiSecret) => [apiId, apiSecret]);
  })
  .spread((apiId, apiSecret) => {
    globalConf.auth = {apiId, apiSecret}
    globalConf.save();
  })
  .then(() => {
    cli.ok('Saved your config to ~/.reploy');
  });
