'use strict';

/* jshint esnext: true, node:true */

import cli from 'cli';
import Promise from 'bluebird';
import val from 'validator';
import path from 'path';

export const withInputAsync = () => {
  return new Promise((resolve, reject) => {
    cli.withInput((line) =>{
      resolve(line);
    });
  });
};

/**
 * Reads a single line, compares it with `predicate`
 * and either outputs and error message and waits for more
 * input or resolves the promise with the valid value
 * @param  {function} predicate The predicate to use for input checking
 * @param  {string} errorMsg    The error message to show
 * @return {object}             A promise
 */
const readLine = (predicate, errorMsg) => {
  return withInputAsync()
    .then((input) => {
      if (!predicate(input)) {
        cli.output(errorMsg);
        return readLine(predicate, errorMsg);
      }

      return input.trim();
    });
};

export const readApiIdFromCLI = () => {
  cli.output('Enter your API ID:');
  return readLine(
    (token) => val.isLength(token, 16),
    'Please enter a valid API ID (16 characters)'
  );
};

export const readApiSecretFromCLI = () => {
  cli.output('Enter your API Secret:');
  return readLine(
    (token) => val.isLength(token, 43),
    'Please enter a valid API secret (43 characters)'
  );
};

export const maybeUsePackageName = () => {
  let name;
  try {
    name = require(path.join(process.cwd(), 'package.json')).name;
  } catch (e) {}

  if (name) {
    cli.output(`We found the following project name: ${name} - do you want to use it? y/n`);
    return readLine((input) => {
      input = input.trim().toLowerCase();
      return input === 'y' || input === 'n';
    }, 'Please answer with "y" or "n"')
    .then((answer) => answer === 'y' ? name : void 0);
  }
};
