var fileConfig = {};

try {
  fileConfig = require('./config.json');
} catch(e) {
  let isSyntaxError = (e instanceof SyntaxError);
  let isLogfileMissing = e.message.startsWith("Cannot find module");
  if (isSyntaxError) {
    console.error(e);
  } else if (isLogfileMissing) {
    console.log("No log file. Using defaults.");
  } else {
    console.error(e);
  }
}

var defaults = {
  simulateLogUpdates: true,
  logFile: './auth.log'
};

console.log(Object.assign(defaults, fileConfig));

module.exports = Object.assign(defaults, fileConfig);
