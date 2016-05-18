#!/usr/bin/env node

import program from 'commander';
import fs  from 'fs';
import cli from 'cli';
import db, {request} from './api';

import { appConf } from './environment';
import { buildPathIos, uploadBuild } from './util/postBuildUpload';
import { getDefaultSimulator, getXcodeProject } from './util';
import { getProjectName, platformPrompt } from './util';
import { spawnSync } from 'child_process';

program
  .option('-p, --platform [platform]', 'Platform: "ios" or "android". REQUIRED.')
  .option('-a, --applicationId [applicationId]', 'Your application ID on Reploy. Use \'reploy list-apps\' to get it.')
  .option('-t, --token [token]', 'Your Reploy authentication token.')
  .option('-b, --buildPath [buildPath]', 'Optional build file path for custom builds.')
  .option('-s, --skip', 'Skip the automated build step. Either re-upload the previous build, or upload the build file specified by -b.')
  .option('-n, --name [name]', 'Name this build - i.e.: PR-201, v1.0, a3dffc.')
  .option('-g, --github-token [githubToken]', 'Github token for adding a link to the Reploy build. Use only with -c.')
  .option('-c, --commit-hash [commitHash]', 'Git commit hash whose status should be updated with the build Reploy URL.')
  .option('-r, --repository-name [repositoryName]', 'Github repository name, i.e.: rnplay/rnplay-native.')
  .option('-u, --build-url [buildUrl]', 'URL to link to from the Reploy build screen.')
  .option('-i, --github-api-prefix [githubApiPrefix]', 'Github API URL prefix for Github Enterprise users. Default: https://api.github.com.')
  .parse(process.argv);

if (!program.platform || program.platform.length == 0) {
  console.log();
  cli.error("Please specify 'ios' or 'android' with the -p option.");
  program.outputHelp();
}

if (program.token) {
  db.setToken(program.token)
}

if (!program.applicationId && !fs.existsSync(appConf.__filename)) {
  cli.error(`\nCouldn't find the Reploy config file named .reploy at the application root.\nRun 'reploy create' to get setup, or use the -a option to specify your ID manually. Use 'reploy list-apps' to see your application IDs.\n`);
  process.exit(1);
}

async function run() {

  let platform = null;

  if (program.platform) {
    platform = program.platform;
  } else {
    platform = platformPrompt();
  }

  if (!program.buildPath) {
    platform === 'ios' ? buildIOS() : buildAndroid();
  }

  await uploadBuild(platform, {buildPath: program.buildPath, applicationId: program.applicationId, name: program.name, url: program.buildUrl});

  if (program.commitHash || program.githubToken || program.repositoryName) {
    if (program.commitHash && program.githubToken && program.repositoryName) {
      try {
        let response = await request
        .post(`${program.githubApiPrefix || "https://api.github.com/repos"}/${program.repositoryName}/statuses/${program.commitHash}?access_token=${program.githubToken}`)
        .send({
          "state": "success",
          "target_url": `https://app.reploy.io/apps/${program.applicationId || appConf.app.id}/test/${program.name}`,
          "description": "Test this build on Reploy.",
          "context": "ci/reploy"
        });
        cli.ok(`Updated Github status for commit ${program.commitHash} on ${program.repositoryName}.`)

      } catch (error) {
        cli.error(error)
      }
    } else {
      cli.error("To post a build URL to Github, please specify all of these flags: -c, -r, -g and -n")
    }
  }
}

function buildIOS() {
  let xcodeProject = getXcodeProject();
  let selectedSimulator = getDefaultSimulator();

  const xcodebuildArgs = [
    xcodeProject.isWorkspace ? '-workspace' : '-project', `./ios/${xcodeProject.name}`,
    '-scheme', getProjectName(),
    '-destination', `id=${selectedSimulator.udid}`,
    '-configuration', 'Release',
    'CODE_SIGNING_REQUIRED=NO',
    'CONFIGURATION_BUILD_DIR=/tmp/' + getProjectName(),
  ];

  if (!program.skip) {
    cli.info(`Building iOS project ${xcodeProject.name}`);
    cli.info(`Running: xcodebuild ${xcodebuildArgs.join(' ')}`);
    let buildCommand = spawnSync('xcodebuild', xcodebuildArgs, {stdio: 'inherit'});
    if (buildCommand.status != 0) {
      cli.error(`Build failed: ${buildCommand.error}`);
      process.exit(1);
    }
  }

  cli.info("Zipping build before upload...");
  process.chdir(`/tmp/${getProjectName()}`);
  spawnSync('zip', ['-r', buildPathIos,  '.']);
}

function buildAndroid() {
  if (!fs.existsSync('./android')) {
    cli.error("Unable to locate the 'android' directory. Run this command from the root directory of your React Native project.")
    process.exit(1)
  }

  if (!program.skip) {
    cli.info('Building android release...');
    process.chdir('./android');
    spawnSync('./gradlew', ['assembleRelease'], {stdio: 'inherit'});
  } else {
    cli.info("Skipping android build...");
  }
}

run();
