import child_process from 'child_process'
import fs from 'fs'
import homedir from 'os-homedir';
import path from 'path';
import readlineSync from 'readline-sync';

import findXcodeProject from './util/findXcodeProject';
import parseIOSSimulatorsList from './util/parseIOSSimulatorsList';

const buildDirIos = path.join(homedir(), '/Library/Developer/Xcode/DerivedData');

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function checkForReact() {
  // @TODO Super basic. Can get more elaborate as needed.
  return fs.existsSync('./node_modules/react-native');
}

export function platformPrompt() {
  const options = ['iOS', 'Android'];
  const index = readlineSync.keyInSelect(options, 'Choose a platform?');
  if (!options[index]) {
    process.exit(1)
  } else {
    return options[index].toLowerCase();
  }
}

export function getXcodeProject() {
  const xcodeProject = findXcodeProject(fs.readdirSync('./ios'));
  if (!xcodeProject) {
   throw new Error(`Could not find Xcode project files in ios folder`);
  } else {
    return xcodeProject;
  }
}

export function getProjectName() {
  let file = getXcodeProject().name;
  let segments = file.split('/');
  return segments[segments.length - 1].split('.')[0];
}

export function getSimulatorBuilds() {
  return parseIOSSimulatorsList(child_process.execFileSync('xcrun', ['simctl', 'list', 'devices'], {encoding: 'utf8'}))
}

export function getDefaultSimulator() {
  const simulators = getSimulatorBuilds();

  // @TODO:
  // Do we want to expose this as a build option by listing the
  // available simulators from our util function?

  const selectedSimulator = simulators.find(sim => sim.name === 'iPhone 6');

  if (!selectedSimulator) {
    throw new Error(`Cound't find ${args.simulator} simulator`);
  } else {
    return selectedSimulator;
  }
}

export function latestBuildPath() {
  let simulatorBuildPaths = filter(fs.readdirSync(buildDirIos), (path) => {
    return path.indexOf(projectName()) > -1;
  });

  if (simulatorBuildPaths.length == 0) {
    return null;
  }

  simulatorBuildPaths.sort(function(a, b) {
    return fs.statSync(`${buildDirIos}/${b}`).mtime.getTime() - fs.statSync(`${buildDirIos}/${a}`).mtime.getTime();
  });

  return simulatorBuildPaths[0];
}
