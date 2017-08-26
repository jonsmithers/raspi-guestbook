var fileConfig = {};

try {
  fileConfig = require('./config.json');
} catch(e) {
  let isSyntaxError = (e instanceof SyntaxError);
  if (isSyntaxError) {
    console.error(e);
  } else {
    console.log("Couldn't load log file");
  }
}

var config = Object.assign({
  ON_RASPBERRY: false,
  get logFile() {
    return (this.ON_RASPBERRY ? '/var/log/auth.log' : './auth.log');
  }
}, fileConfig);


console.log(config);

module.exports = config;
