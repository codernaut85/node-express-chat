const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.static("dist"));

app.get("/", (request, response) => {
 	const filePath = "./dist/index.html";
 	const resolvedPath = path.resolve(filePath);
 	return response.sendFile(resolvedPath);
});

let registeredUsers = [];

io.on("connection", (socket) => {

	console.log("A user has connected");

	io.emit("transfer initial list of active users", registeredUsers);

	socket.on("disconnect", () => {

		console.log("DELETING USER");

		registeredUsers = registeredUsers.filter((user) => {
			console.log(user);
			console.log(socket.username);
			return user !== socket.username;
		});

		console.log(registeredUsers);

		io.emit("chat message", {
			fromUser: "admin",
			messageText: (socket.username ? socket.username : "an anonymous user") + " has just disconnected"
		});

		if (socket.username) {
			io.emit("update active users list", registeredUsers);
		}
	});

	socket.on("chat message", (message) => {
		io.emit("chat message", {
			fromUser: (socket.username ? socket.username : "anonymous"),
			messageText: message
		});
	});

	socket.on("register new user", (name) => {

		let userAlreadyExists;

		registeredUsers.filter((user) => {
			if (user.toLowerCase() === name.toLowerCase()) {
				userAlreadyExists = true;
			}
		});

		if (userAlreadyExists) {
			console.log("User already exists");
			socket.emit("user already exists");
		} else if (name === "admin" || name === "Admin") {
			console.log("You cannot use the username 'admin'!");
			socket.emit("cannot name self admin");
		} else {
			socket.username = name;

			registeredUsers.push(name);

			socket.emit("user registration confirmed", name);

			socket.broadcast.emit("chat message", {
				fromUser: "admin",
				messageText: name + " has just registered"
			});

			io.emit("add user to active users list", name);
		}

	});
});

http.listen(3000, () => {
	console.log("listening on *:3000");
});