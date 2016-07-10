var stylelint = require('stylelint').lint;
var config = JSON.parse(process.argv[2]);

function printResult(data) {
  console.log(JSON.stringify(data));
}

stylelint(config)
  .then(function(data) {
    printResult(data);
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
