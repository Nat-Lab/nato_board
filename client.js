var sharedb = require('sharedb/lib/client');
var StringBinding = require('sharedb-string-binding');
var socket = new WebSocket((window.location.protocol == 'http:' ? 'ws://' : 'wss://') + window.location.host);
var connection = new sharedb.Connection(socket);
var hashname = window.location.hash.substring(1);
var docname = (hashname == '' ? 'default' : hashname);
var doc = connection.get(docname, 'textarea');
window.onhashchange = function() { window.location.reload() }; // do reload on hashtag change (switch channel.)
document.getElementById('title').innerHTML += docname;
doc.subscribe(function(err) {
  if (err) throw err;
  var xhr = new XMLHttpRequest();
  var element = document.querySelector('textarea');
  xhr.open('GET', '/create?name=' + docname);
  xhr.send();
  xhr.onload = function () {
    if (this.status == 200) {
      doc = connection.get(docname, 'textarea');
      window.setTimeout(function() {
        var binding = new StringBinding(element, doc);
        console.log(binding);
        binding.setup();
        element.onkeydown = function(evnt) {
          if(evnt.keyCode == 9 || evnt.which == 9) { // leave that poor tab anlone.
            evnt.preventDefault(); // no. please don't move
            var s = this.selectionStart;
            this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
            this.selectionEnd = s+1;
            binding._inputListener(); // invoke binding update.
          }
        };
      }, 100); // dirty hack, server need some time to create board.
    }
  };
});
