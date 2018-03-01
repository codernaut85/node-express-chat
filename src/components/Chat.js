import React from "react";
import io from "socket.io-client";
import Infobox from "./Infobox";

const socket = io();

class Chat extends React.Component {

	constructor(props) {
		super(props);
		this.registerNewUser = this.registerNewUser.bind(this);
		this.handleMessageTextChange = this.handleMessageTextChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.renderMesssages = this.renderMesssages.bind(this);
		this.state = {
			messages: [],
			userIsRegistered: false,
			messageText: "",
			registrationError: "",
			username: "",
			activeUsers: []
		};
	}

	componentDidMount() {
		socket.on("chat message", (message) => {
			if (!message || !message.messageText) {
				return false;
			}
			this.setState({ messages: [...this.state.messages, message] });
		});

		socket.on("user already exists", () => {
			this.setState({
				userIsRegistered: false,
				registrationError: "That username is already registered"
			});
		});

		socket.on("cannot name self admin", () => {
			this.setState({
				userIsRegistered: false,
				registrationError: "You cannot name yourself 'admin'"
			});
		});

		socket.on("user registration confirmed", (name) => {
			this.setState({
				userIsRegistered: true,
				username: name
			});
		});

		socket.on("transfer initial list of active users", (users) => {
			this.setState({
				activeUsers: users
			});
		});

		socket.on("add user to active users list", (name) => {
			this.setState({
				activeUsers: [...this.state.activeUsers, name]
			});
		});

		socket.on("update active users list", (users) => {
			this.setState({
				activeUsers: users
			});
		});
	}

	componentDidUpdate () {
		const messageListHTML = document.getElementById("messages");

		if (messageListHTML) {
			messageListHTML.scrollTop = messageListHTML.scrollHeight;
		}
	}

	registerNewUser(e) {
		let value;

		if (e.key === "Enter") {
			value = e.target.value;
			if (!e.target.value) {
				return false;
			}
			socket.emit("register new user", value);
			e.target.value = "";
		}
	}

	handleMessageTextChange(e) {
		this.setState({
			messageText: e.target.value
		});
	}

	handleSubmit(e) {
		e.preventDefault();

    	if (this.state.messageText) {
			socket.emit("chat message", this.state.messageText);
		}

		this.setState({
			messageText: ""
		});
	}

	renderMesssages() {
		let messageList = [];
		const messages = this.state.messages;

		messages.map((message) => {
			messageList.push(<li className={"chat-app__content__messages__message" + (message.fromUser === "admin" ? " admin" : "")}>{message.fromUser + ": " + message.messageText}</li>);
		})

		return messageList;
	}

	listActiveUsers() {
		const users = [];
		
		this.state.activeUsers.map((user) => {
			users.push(<li className="chat-app__active-users__list__item">{user}</li>);
		});

		return users;
	}

	render() {
		return (
			<section className="chat-app clearfix">
				<h1>Welcome to Node Chat</h1>
				<p>{this.state.activeUsers.length + " active user" + (this.state.activeUsers.length === 1 ? "" : "s")}</p>
				{ this.state.userIsRegistered && this.state.username ?  
					<p>Registered as: {this.state.username}</p>
					:
					null
				}
				{this.state.activeUsers ? 
					<aside className="chat-app__active-users">
						<h2>Current active users</h2>
						<ul className="chat-app__active-users__list">{this.listActiveUsers()}</ul>
					</aside>
					:
					null
				}
				{ this.state.userIsRegistered ? 
					<div className="chat-app__content">
						<ul className="chat-app__content__messages" id="messages">
						{ this.renderMesssages() }
						</ul>
						<div className="chat-app__content__controls">
							<form className="form-group send-chat clearfix" onSubmit={this.handleSubmit}>
								<input value={this.state.messageText} className="send-chat__text" id="messageTextInput" autoComplete="off" onChange={this.handleMessageTextChange} />
								<button type="submit" className="send-chat__button">SEND</button>
							</form>
						</div>
					</div>
					: 
					<div className="chat-app__register" id="registerNewUser">
						{this.state.registrationError ? 
							<Infobox type={"error"} text={this.state.registrationError} />
							:
							null
						}
						<div className="form-group">
							<label>Choose a username</label>
							<input autoFocus className="chat-app__register__text" id="username" autoComplete="off" onKeyPress={this.registerNewUser} placeholder="joebloggs" />
						</div>
					</div> 
				}
			</section>
		);
	}
}

export { Chat };