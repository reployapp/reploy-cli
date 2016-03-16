#!/usr/bin/env node --harmony

import Sendgrid from 'sendgrid';
import program from 'commander';
const superagent = require('superagent-promise')(require('superagent'), Promise);

program
  .option('-e, --email [email]', 'Beta invitee\'s email address')
  .parse(process.argv);

async function run() {
  let result = await superagent.post('https://webtask.it.auth0.com/api/run/wt-joshua-diluvia_net-0/inviteBetaUser')
    .send({email: program.email});
};

run();
