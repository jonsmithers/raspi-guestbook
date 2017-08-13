global.ON_RASPBERRY = false;
global.LOGFILE      = global.ON_RASPBERRY ? '/var/log/auth.log' : './auth.log';

const server = require('./server');
const logWatcher = require('./log-watcher');


global.run = () => {
  if (!global.ON_RASPBERRY) {
    console.log('(starting test script)');
    logWatcher.runTestScript().then(() =>
      console.log('(test script finished)')
    ).catch(console.error);
  }
};

global.run(); // comment this out if you want to attach debugger first
// (function wait () { setTimeout(wait, 1000); } )(); // prevent process from exiting
