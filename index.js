const config = require('./config');
const logWatcher = require('./log-watcher');
require('./server');


global.run = () => {
  if (config.simulateLogUpdates) {
    console.log('(starting test script)');
    logWatcher.runTestScript().then(() =>
      console.log('(test script finished)')
    ).catch(console.error);
  }
};

global.run(); // comment this out if you want to attach debugger first
// (function wait () { setTimeout(wait, 1000); } )(); // prevent process from exiting
