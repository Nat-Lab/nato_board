var sharedb = require('sharedb/lib/client');
var StringBinding = require('sharedb-string-binding');

var socket = new WebSocket((window.location.protocol == 'http:' ? 'ws://' : 'wss://') + window.location.host);
var connection = new sharedb.Connection(socket);

var hashname = window.location.hash.substring(1);
var docname = (hashname == '' ? 'default' : hashname);
var doc = connection.get(docname, 'textarea');
document.getElementById('title').innerHTML += docname;
doc.subscribe(function(err) {
  if (err) throw err;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/create?name=' + docname);
  xhr.send();
  xhr.onload = function () {
    if (this.status == 200) {
      doc = connection.get(docname, 'textarea');
      window.setTimeout(function() {
        var element = document.querySelector('textarea');
        var binding = new StringBinding(element, doc);
        binding.setup();
      }, 100); // dirty hack, server need some time to create board. 
    }
  };
});
