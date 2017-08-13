const Hapi = require('hapi');
const server = new Hapi.Server();
const accumulatedData = [];

server.connection({port: '8000'});
server.route({
  method: 'GET',
  path:'/',
  handler: function (request, reply) {
    return reply(accumulatedData);
  }
});
server.start(err => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});



const logWatcher = require('./log-watcher');
logWatcher.observable.subscribe((object) => {
  accumulatedData.push(object);
  console.log(object);
}, console.error);
