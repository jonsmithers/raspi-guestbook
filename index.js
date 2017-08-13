global.ON_RASPBERRY = false;
global.LOGFILE      = global.ON_RASPBERRY ? '/var/log/auth.log' : './auth.log';

const logWatcher = require('./log-watcher');

global.run = () => {
  logWatcher.observable.subscribe(({date, ip}) => {
    console.log(ip, new Date(date).toLocaleString());
  }, console.error);
  console.log('subscriber created');

  console.log('running test script');
  logWatcher.runTestScript();
};

global.run(); // comment this out if you want to attach debugger first
// (function wait () { setTimeout(wait, 1000); } )(); // prevent process from exiting

