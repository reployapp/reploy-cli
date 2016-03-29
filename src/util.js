import fs from 'fs'
import readlineSync from 'readline-sync';

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
