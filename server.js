let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

app.use(express.static(__dirname + '/app'));
app.use('/app', express.static('app'));

io.on('connection', (client) => {
  console.log(`Client connected...`);
  client.on('join', (name) => {
    client.nickName = name;
  });
  client.on('messages', (message) => {
    let nickName = client.nickName;
    console.log(`${nickName}: ${message}`);
    client.broadcast.emit('messages', `${nickName}: ${message}`);
    client.emit('messages', `${nickName}: ${message}`);
  });
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/app/index.html`);
});

server.listen(8888);
