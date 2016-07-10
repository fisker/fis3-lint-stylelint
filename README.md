# fis3-lint-htmlhint
a css/less/scss/sugarss linter plugin of fis3 based on eslint

[![npm](https://img.shields.io/npm/v/fis3-lint-stylelint.svg?style=flat-square)](https://www.npmjs.com/package/fis3-lint-stylelint) 
[![npm](https://img.shields.io/npm/dt/fis3-lint-stylelint.svg?style=flat-square)](https://www.npmjs.com/package/fis3-lint-stylelint) 
[![npm](https://img.shields.io/npm/dm/fis3-lint-stylelint.svg?style=flat-square)](https://www.npmjs.com/package/fis3-lint-stylelint)

## usage

    $ npm i -g fis3-lint-stylelint

```
// fis-conf.js

var stylelintConf = {}; 

fis.match('*.{css,scss,less,sss}}', {
  lint: fis.plugin('stylelint', stylelintConf)
});

```
options list

```
var stylelintConf = {
  code: // this will be unset
  codeFilename: // this will be unset
}; 
```
for more info: [http://stylelint.io/user-guide/node-api/]
