# fluidgraph
Library to create and manage graphs

Go to the wiki to read the documentation !
https://github.com/fluidlog/fluidgraph/wiki

## Code documentation
If you wish to contribute to the code documentation, we recently added a package.json which allow us to install JSDoc using npm.
Clone the project, and then:
```
npm install
```
This command should install both jsdoc and ink-docstrap into a node-modules directory.

We are using JSDoc, which is parsing the comments and annotations in the JS code. SO first step, adding relevant comments.
Then, use the following command to generate documentation:

```
./node_modules/.bin/jsdoc ./app -r -t ./node_modules/ink-docstrap/template -d ./documentation -R README.md
```
