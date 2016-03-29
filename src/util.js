import fs from 'fs';

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function checkForReact() {
  // @TODO Super basic. Can get more elaborate as needed.
  return fs.existsSync('./node_modules/react-native');
}
