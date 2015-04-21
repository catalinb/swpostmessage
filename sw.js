function debug(msg) {
  console.log(performance.now() + ' Service Worker ' + msg);
}

var _client;

function client() {
  if (_client) {
    return Promise.resolve(_client);
  }
  return self.clients.matchAll().then(function(clients) {
    if (!clients.length) {
      return Promise.reject();
    }
    _client = clients[0];
    return _client;
  });
}

this.addEventListener('install', function(e) {
  debug('oninstall');
});

this.addEventListener('activate', function() {
  debug('onactivate');
});

this.addEventListener('fetch', function(e) {
  debug('onfetch ' + e.request.url);
});

this.addEventListener('message', function(msg) {
  debug('GOT MESSAGE ' + msg.data);

  client().then(function(c) {
    c.postMessage('using client');
  });
  msg.source.postMessage('using msg.source');
});
