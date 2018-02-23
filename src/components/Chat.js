import React from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";

const socket = io();

class Chat extends React.Component {

	constructor(props) {
		super(props);
		this.registerNewUser = this.registerNewUser.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.renderMesssages = this.renderMesssages.bind(this);
		this.state = {
			messages: []
		};
	}

	componentDidMount() {
		socket.on("chat message", (message) => {
			console.log("message: " + message);
			this.setState({ messages: [...this.state.messages, message] });
		});
	}

	registerNewUser(e) {
		console.log("Registering a new user");
		console.log("this.state");
		console.log(this.state);

		let value;

		if (e.key === "Enter") {
			value = e.target.value;
			if (!e.target.value) {
				return false;
			}
			socket.emit("chat message", value + " has just registered");
			e.target.value = null;
		}
	}

	sendMessage(e) {
		console.log("Registering a new user");

		let value;
		console.log("this.state.messages");
		console.log(this.state.messages);

		if (e.key === "Enter") {
			value = e.target.value;
			if (!e.target.value) {
				return false;
			}
			socket.emit("chat message", value);
			e.target.value = null;
		}
	}

	renderMesssages() {
		let messageList = [];
		const messages = this.state.messages;

		console.log(typeof(messages));
		console.log(messages);

		for (let i = 0; i < messages.length; i++) {
			messageList.push(<li className="messages__message">{messages[i]}</li>);
		}

		return messageList;
	}

	render() {
		return (
		<section>
			<ul className="messages" id="messages">
				{ this.renderMesssages() }
			</ul>
			<div className="controls">
				<div id="registerNewUser">
					<input id="username" autoComplete="off" onKeyPress={this.registerNewUser} />
				</div>
				<div>
					<input id="message" autoComplete="off" onKeyPress={this.sendMessage} />
				</div>
			</div>
		</section>
		);
	}
}

export { Chat };