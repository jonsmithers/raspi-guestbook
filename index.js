const Tail  = require('tail').Tail;
const spawn = require('child_process').spawn;
const exec  = require('child_process').exec;
const Rx    = require('rx');

const ON_RASPBERRY = false;
const LOGFILE      = ON_RASPBERRY ? '/var/log/auth.log' : './auth.log';

global.execute = () => {

  var ready = new Promise((resolve, reject) => {
    if (ON_RASPBERRY) {
      resolve();
    } else {
      exec(`touch ${LOGFILE}`, (error, stdout, stderr) => {
        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);
        if (error) return reject(error);
        return resolve(stdout);
      });
    }
  });

  ready.then(() => {

    let logObservable = Rx.Observable.create(function subscribe(observer) {
      let tail = new Tail(LOGFILE);
      tail.on('line',  line => observer.next(line));
      tail.on('error', error => observer.error(error));
    }).map(line => {
      let matches = /(\w{3}\s+\d+\s+[0-9:]+).*?Failed password for (\w+) from ([0-9.]+)/.exec(line);
      if (matches) {
        let currentYear = new Date().getFullYear();
        let [_, dateStr, user, ip] = matches;
        let date = new Date(dateStr);
        date.setFullYear(currentYear);
        return {
          ip,
          date: date.toJSON()
        };
      }
      return null;
    }).filter(log => !!log);

    logObservable.subscribe(({date, ip}) => {
      console.log(ip, new Date(date).toLocaleString());
    }, console.error, console.log);

    if (!ON_RASPBERRY) {
      let testscript = spawn('bash', ['./test-append.sh']);
      testscript.stderr.on('data', console.error);
      testscript.on('exit', () => {
        console.log("(test script has ended)");
      });
    }
  });
};

// comment this out if you want to attach debugger first
global.execute();

// prevent process from exiting
(function wait () { setTimeout(wait, 1000); } )();

