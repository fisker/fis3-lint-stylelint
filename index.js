/*
 * fis3-lint-stylelint
 * fisker Cheung<lionkay@gmail.com>
 */

var package = require('./package.json');
var packageName = package.name || 'fis3-lint-stylelint';
var spawnSync = require('child_process').spawnSync;
var path = require('path');
var fs = require('fs');
var assign = require('lodash.assign');
var log = (global.fis && fis.log) || console;
var nodePath = 'node';
var stylelintBin = path.normalize(path.join(__dirname, './bin/stylelint.js'));
var stylefmtBin = path.normalize(path.join(__dirname, './bin/stylefmt.js'));
var formatter = require('postcss-reporter/lib/formatter')({noPlugin: true});

var syntax = {
  '.scss': 'scss',
  '.less': 'less',
  '.sss': 'sugarss'
}

function nodeBin() {
  var args = [].slice.call(arguments).map(function(arg) {
    return typeof arg === 'string' ? arg : JSON.stringify(arg);
  });
  var result = spawnSync(nodePath, args, {encoding: 'utf-8'});

  if (result.error) {
    log.warn(
      result.error.message,
      result.error.stack
    );
    process.exit(1);
  }

  result = result.stdout + '';

  try {
    result = JSON.parse(result);
  } catch(err) {
    result = null;
  }

  return result;
}

module.exports = function(content, file, conf){
  if (!content) {
    return;
  }

  console.log('stylelint:' + file.id);

  var config = assign({}, conf, {
    extractStyleTagsFromHtml: false,
    formatter: 'string',
    files: file.realpath
  });
  delete config.filename;
  delete config.code;
  delete config.codeFilename;

  if (!config.syntax && syntax[file.ext]) {
    config.syntax = syntax[file.ext]
  }

  if (config.fix) {
    var fixResult = nodeBin(stylefmtBin, config);
    if (fixResult && fixResult.css) {
      content = fixResult.css;
    }
  }
  delete config.fix;

  var result = nodeBin(stylelintBin, config);
  if (result && result.error) {
    log.warn(
      result.error.message,
      result.error.stack
    );
    process.exit(1);
  }

  if (result && result.errored) {
    // log.warn(
    //   '[%s] lint failed with %s: \n\n %s',
    //   file.id,
    //   'error',
    //   formatter({
    //     messages: result.results[0].warnings,
    //     source: result.results[0].source
    //   })
    // );

    log.warn(
      '[%s] lint failed with %s: \n\n %s',
      file.id,
      'error',
      result.output
    );
    process.exit(1);
  }
};




