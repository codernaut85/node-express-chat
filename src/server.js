const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.static("dist"));

app.get("/", (request, response) => {
 	const filePath = "./dist/index.html";
 	const resolvedPath = path.resolve(filePath);
 	console.log(resolvedPath);
 	return response.sendFile(resolvedPath);
});

io.on("connection", (socket) => {

	console.log("a user connected");
	io.emit("chat message", "A user has connected");

	socket.on("disconnect", () => {
		io.emit("chat message", (socket.username ? socket.username : "Anonymous") + " has disconnected");
	});

	socket.on("chat message", (message) => {
		console.log(message);
		io.emit("chat message", socket.username + " : " + message );
	});

	socket.on("register new user", (name) => {
		console.log(name);
		socket.username = name;
		io.emit("chat message", (socket.username ? socket.username : "Anonymous") + " has just registered");
	});
});

http.listen(3000, () => {
	console.log("listening on *:3000");
});