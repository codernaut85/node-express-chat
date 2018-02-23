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

	let username;

	console.log("a user connected");
	io.emit("chat message", "A user has connected");

	socket.on("disconnect", () => {
		console.log("a user disconnected");
		io.emit("chat message", username ? (username + " has disconnected") : ("an anonymous user has disconnected"));
	});

	socket.on("chat message", (message) => {
		console.log("message: " + message);
		io.emit("chat message", username ? (username + ": " + message) : ("Anonymous" + ": " + message));
	});

	socket.on("register new user", (value) => {
		console.log(value + " has just connected");
		username = value;
		io.emit("chat message", username + " has just registered");
	});
});

http.listen(3000, () => {
	console.log("listening on *:3000");
});