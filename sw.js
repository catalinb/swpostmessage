function debug(msg) {
  console.log(performance.now() + ' Service Worker ' + msg);
}

var _client;

function client() {
  if (_client) {
    debug('have _client');
    return Promise.resolve(_client);
  }
  return self.clients.matchAll().then(function(clients) {
    if (!clients.length) {
      return Promise.reject();
    }
    debug("LENGTH:" +clients.length);
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
  debug('fetch.client=' + e.client);
  client().then(function(c) {
    debug('CLIENT ' + c);
    c.postMessage('using client before receiving message');
  });
});

this.addEventListener('message', function(msg) {
  debug('GOT MESSAGE ' + msg.data);

  client().then(function(c) {
    debug('CLIENT WITHIN MESSAGE HANDLER ' + c);
    c.postMessage('using client after receiving message');
  });
  if (msg.source) {
    msg.source.postMessage('using msg.source');
  } else {
    debug("msg.source is null");
  }
});
