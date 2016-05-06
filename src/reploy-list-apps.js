#!/usr/bin/env node

import { query } from './api';
import Table from 'cli-table';
import colors from 'colors';

const table = new Table({
  head: [
    colors.cyan('Name'),
    colors.cyan('Invitees'),
    colors.cyan('Screenshots'),
    colors.cyan('Version')
  ],
  colWidths: [25, 15, 15, 15]
});

async function run() {
  try {
    let result = await query(`
      user {
        applications {
          count,
          nodes {
            id
            name
            screenshots {
              count,
            }
            invitedUsers {
              count
            }
            binaryUploads(last: 1) {
              nodes {
               versionCode
              }
            }
          }
        }
      }`);

    const { applications } = result.user;

    if (applications.count === 0) {
      console.log('Uh oh! No applications found. \nPlease make sure you\'ve created an app and that your accounts token is set in /~.reploy');
    } else {
      applications.nodes.forEach((app) => {
        table.push([
          app.name,
          app.invitedUsers.count,
          app.screenshots.count,
          app.binaryUploads.nodes[0].versionCode
        ]);
      });
      console.log(table.toString());
    }
  } catch(error) {
    console.log(error);
  }
}

run();
