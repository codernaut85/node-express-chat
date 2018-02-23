const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get("/", (request, response) => {
	response.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
	console.log('a user connected');
	io.emit('chat message', 'A user has connected');

	socket.on('disconnect', () => {
		console.log('a user disconnected');
		io.emit('chat message', 'A user has disconnected');
	});

	socket.on('chat message', (message) => {
		console.log('message: ' + message);
		io.emit('chat message', message);
	});
});

http.listen(3000, () => {
	console.log('listening on *:3000');
});