const Tail  = require('tail').Tail;
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;

const ON_RASPBERRY = false;
const LOGFILE      = ON_RASPBERRY ? '/var/log/auth.log' : './auth.log';

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
  let tail = new Tail(LOGFILE);
  tail.on('line',  line => {
    // Aug  7 01:49:34
    let matches = /(\w{3}\s+\d+\s+[0-9:]+).*?Failed password for (\w+) from ([0-9.]+)/.exec(line);
    if (matches) {
      let currentYear = new Date().getFullYear();
      let [_, dateStr, user, ip] = matches;
      let date = new Date(dateStr);
      date.setFullYear(currentYear);
      console.log(date.toLocaleString(), 'ip', ip);
      var logObject = {
        ip,
        date: date.toJSON()
      };
    }
  });
  tail.on('error', console.error);

  if (!ON_RASPBERRY) {
    let testscript = spawn('bash', ['./test-append.sh']);
    testscript.stderr.on('data', console.error);
    testscript.on('exit', () => {
      console.log("(test script has ended)");
    });
  }
});
