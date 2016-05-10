import child_process from 'child_process'
import fs from 'fs'
import homedir from 'os-homedir';
import path from 'path';
import cli from 'cli';

import findXcodeProject from './util/findXcodeProject';
import parseIOSSimulatorsList from './util/parseIOSSimulatorsList';

const buildDirIos = path.join(homedir(), '/Library/Developer/Xcode/DerivedData');

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function checkForReact() {
  // @TODO Super basic. Can get more elaborate as needed.
  if (!fs.existsSync('./node_modules/react-native')) {
    cli.error('Did you mean to run this inside a react-native project?');
    process.exit(1);
  } else {
    return;
  }
}

export function getXcodeProject() {
  if (fs.existsSync('./ios')) {
    const xcodeProject = findXcodeProject(fs.readdirSync('./ios'));
    if (!xcodeProject) {
      cli.error('Could not find Xcode project files in ios folder');
    } else {
      return xcodeProject;
    }
  } else {
    cli.error(`Unable to locate 'ios' directory.\nRun this command from the root directory of your React Native project.`);
  }
}

export function getProjectName() {
  let file = getXcodeProject();
  if (file) {
    let segments = file.name.split('/');
    return segments[segments.length - 1].split('.')[0];
  }
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
