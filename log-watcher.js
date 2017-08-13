const Rx    = require('rx');
const Tail  = require('tail').Tail;
const exec  = require('child_process').exec;
const spawn = require('child_process').spawn;

const observable = Rx.Observable.create(function subscribe(observer) {

  var whenReadyToStart = new Promise((resolve, reject) => {
    if (global.ON_RASPBERRY) {
      resolve();
    } else {
      exec(`touch ${global.LOGFILE}`, (error, stdout, stderr) => {
        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);
        if (error) return reject(error);
        return resolve(stdout);
      });
    }
  });

  whenReadyToStart.then(() => {
    let tail = new Tail(global.LOGFILE);
    tail.on('line',  line => observer.next(line));
    tail.on('error', error => observer.error(error));
  });

}).map(line => {

  let matches = /(\w{3}\s+\d+\s+[0-9:]+).*?Failed password for (\w+) from ([0-9.]+)/.exec(line);
  if (matches) {
    let currentYear = new Date().getFullYear();
    let [wholeString, dateStr, user, ip] = matches;
    let date = new Date(dateStr);
    date.setFullYear(currentYear);
    return {
      ip,
      user,
      wholeString,
      date: date.toJSON()
    };
  }
  return null;

}).filter(log => !!log);

module.exports = { 
  observable,
  runTestScript() {
    let testscript = spawn('bash', ['./test-append.sh']);
    testscript.stderr.on('data', console.error);
    testscript.on('exit', () => {
      console.log("(test script has ended)");
    });
  }
};
