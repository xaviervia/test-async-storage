# Demostration of Async Storage package.json issue

To reproduce: 

1. Clone this repo
2. Run `yarn`
3. Run `yarn start app ios` or `yarn start app android` (either will demonstrate the issue and show the red screen of death)

To test the fix:

1. Run `yarn start patchAsyncStorage` . This will replace the package.json entry `"react-native": "src/index.js",` with `"react-native": "lib/module/index.js",` in the `@react-native-community/async-storage` package json file.
2. Run again either `yarn start app ios` or `yarn start app android`
