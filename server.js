if(!process.argv[2]) {
  console.error('usage: node ' + process.argv[1] + ' <port>');
  process.exit(1);
}

var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var WebSocket = require('ws');
var WebSocketJSONStream = require('websocket-json-stream');
var backend = new ShareDB();
var docs = [], conn = backend.connect();
var createDoc = function (name, cb) {
  docs[name] = conn.get(name, 'textarea');
  docs[name].fetch(function(err) {
    if (err) throw err;
    if (docs[name].type === null) {
      docs[name].create('歡迎來到妳新的協作板。將這個頁面的鏈接發給其他人來開始協作。');
   }
  });
}

var app = express();

app.use(express.static('static'));

app.get('/create', function (req, res) {
  var name = req.query.name;
  if(!name) {
    res.status(500).end();
    return;
  }
  res.status(200).end();
  createDoc(name);
});

var server = http.createServer(app);
var wss = new WebSocket.Server({server: server});
wss.on('connection', function(ws, req) {
  var stream = new WebSocketJSONStream(ws);
  backend.listen(stream);
});

var port = parseInt(process.argv[2]);

server.listen(port, function () {
  console.log("nato_board server running on port " + port + ".\nVisit http://yourhost.com:" + port + "/#your_board" + " to start working collaboratively.");
});
