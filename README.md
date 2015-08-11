# reploy-cli

Reploy CLI for managing React Native application bundles

# Install

```
npm install -g 
```

# Usage

Sign up at http://reploy.io/sign_up.

Copy the credentials you see to ~/.reploy.

## Create an app for deployment

From a React Native application directory, run: 

```
% reploy create-app
```

Check the newly created .reploy file in the current app directory. Use these credentials with react-native-versions for managing javascript versions.

## Push a javascript version

```
% reploy push-js
```
