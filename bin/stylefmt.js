var stylefmt = require('stylefmt').process;
var fs = require('fs');
var config = JSON.parse(process.argv[2]);
var cssFile = config.files;
var content = fs.readFileSync(cssFile, 'utf-8');
delete config.fix;

function printResult(data) {
  console.log(JSON.stringify(data));
}

stylefmt(content, config)
  .then(function(result) {
    if (result && result.css && result.css !== content) {
      fs.writeFileSync(cssFile, result.css);
    }
    printResult({
      css: result && result.css
    });
  })
  .catch(function(err) {
    printResult({
      error: {
        code: err.code,
        message: err.message,
        stack: err.stack
      }
    });
  });
