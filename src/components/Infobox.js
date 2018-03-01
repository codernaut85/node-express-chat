import React from "react";


class Infobox extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const { text, type } = this.props;

		return (
			<div className={"info-box" + " info-box--" + type}>
				<h2 className="info-box__text">{text}</h2>
			</div>
		);
	}
}

export default Infobox;