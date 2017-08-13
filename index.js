global.ON_RASPBERRY = false;
global.LOGFILE      = global.ON_RASPBERRY ? '/var/log/auth.log' : './auth.log';

const logWatcher = require('./log-watcher');


global.run = () => {
  require('./server').start();
  logWatcher.observable.subscribe(({date, ip, user}) => {
    console.log(user, ip, new Date(date).toLocaleString());
  }, console.error);
  console.log('subscriber created');

  if (!global.ON_RASPBERRY) {
    console.log('(starting test script)');
    logWatcher.runTestScript().then(() =>
      console.log('(test script finished)')
    ).catch(console.error);
  }
};

global.run(); // comment this out if you want to attach debugger first
// (function wait () { setTimeout(wait, 1000); } )(); // prevent process from exiting
