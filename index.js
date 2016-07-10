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
var isArray = Array.isArray;
var log = (global.fis && fis.log) || console;
var nodePath = 'node';

// var nodePath = (function(execPath) {
//   return fs.existsSync(execPath) ?
//     (process.platform === 'win32' ? '"' + path.normalize(execPath) + '"' : path.normalize(execPath)) :
//     'node';
// })(process.execPath);

var binPath = (function (root, packageName, binName) {
  var paths = root ? [path.join(root, binName)] : (function() {
    var folders = [];

    if (global.fis && fis.require && fis.require.paths && isArray(fis.require.paths)) {
      folders = folders.concat(fis.require.paths);
    }

    if (process && process.mainModule && process.mainModule.paths && isArray(process.mainModule.paths)) {
      folders = folders.concat(process.mainModule.paths);
    }

    return folders.map(function(folder) {
      return path.join(folder, packageName, binName);
    });
  })();

  var bin;
  while (bin = paths.shift()) {
    bin = path.normalize(bin);

    if (fs.existsSync(bin)) {
      return bin;
    }
  }
})(__dirname || package._where, packageName, './bin/stylelint.js');


var syntax = {
  '.scss': 'scss',
  '.less': 'less',
  '.sss': 'sugarss'
}


function rightPad(s, length) {
  return (s + Array(length + 1).join(' ')).slice(0, Math.max(s.length, length));
}

function formater(result) {
  var s = [result.source, ''];
  var counter = {}
  result.warnings.sort(function(l, r) {
    if (l.line !== r.line) {
      return l.line - r.line;
    } else {
      return l.column - r.column;
    }
  }).forEach(function(msg) {
    counter[msg.severity] = (counter[msg.severity] || 0) + 1;
    s[s.length] = [
      ' ',
      rightPad(msg.line + ':' + msg.column, 8),
      rightPad(msg.severity, 6),
      rightPad(msg.text, 45),
      //msg.rule
    ].join('');
  });

  return s.join('\n') + '\n \n ×  ' + result.warnings.length + ' problem (' + (counter.error || 0) + ' error, ' + 0 + ' warnings)';
}

module.exports = function(content, file, conf){
  if (!content || !binPath) {
    return;
  }

  var config = assign(conf, {
    extractStyleTagsFromHtml: false,
    formatter: 'json',
    files: file.realpath
  });
  delete config.filename;
  delete config.code;
  delete config.codeFilename;

  if (!config.syntax && syntax[file.ext]) {
    config.syntax = syntax[file.ext]
  }

  var report = spawnSync(nodePath, [
    binPath,
    JSON.stringify(config)
  ]);

  if (report.error) {
    log.warn(
      '[%s] error occurred:\n %s',
      file.id,
      report.error.stack
    );
    process.exit(1);
  }


  try {
    report = JSON.parse(report.stdout);
  } catch(err) {
    log.warn(
      '[%s] error occurred:\n %s',
      file.id,
      err.stack
    );
    process.exit(1);
  }

  if (report.error) {
    log.warn(
      '[%s] error occurred:\n %s',
      file.id,
      report.error.message
    );
    process.exit(1);
  }

  var result = report.results[0];
  var warnings = result.warnings || [];
  var errored = result.errored;

  if (warnings.length) {
    log.warn(
      '[%s] lint failed with %s: \n\n %s',
      file.id,
      errored ? 'error' : 'warning',
      formater(result)
    );
    if (errored) {
      process.exit(1);
    }
  }
};




