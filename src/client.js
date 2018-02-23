import React from "react";
import ReactDOM from "react-dom";
import { Chat } from "./components/Chat";
import { Provider } from "react-redux";

ReactDOM.render(
	<Chat />,
	document.getElementById("app")
);