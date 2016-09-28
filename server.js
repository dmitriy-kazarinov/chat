let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

app.use(express.static(__dirname + '/app'));
app.use('/app', express.static('app'));

io.on('connection', (client) => {
  console.log(`Client connected...`);

  client.on('messages', (data = []) => {
    let dataInfo = data[0];
    let {author, text} = dataInfo;

    client.broadcast.emit('messages', dataInfo);
    client.emit('messages', dataInfo);
  });

});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/app/index.html`);
});

server.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
