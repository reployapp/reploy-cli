import fs from 'fs'
import readlineSync from 'readline-sync';
import { configFilename, globalConf } from './environment';

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function checkForReact() {
  // @TODO Super basic. Can get more elaborate as needed.
  return fs.existsSync('./node_modules/react-native');
}

export function checkForConfig() {
  return fs.existsSync(`${process.env.HOME}/${configFilename}`)
}

export function createReployToken(token) {
  let configPath = `${process.env.HOME}/${configFilename}`;

  if (!token) return console.log('Please enter a valid key.')

  if (fs.existsSync(configPath)) {
    if (readlineSync.keyInYN('Looks like you already have your token set.\nWould you like to overwrite it?')) {
      fs.writeFile(configPath, token + '\n', (err) => {
        if (err) return console.log('Oops! Something went wrong. Please try again.')
      })
    } else {
      process.exit(1);
    }
  } else {
    fs.writeFile(configPath, token + '\n', (err) => {
      if (err) return console.log('Oops! Something went wrong. Please try again.')
    })
  }
}
