import React, { Component } from "react";

import Autosuggest from "../components/Autosuggest/Autosuggest";
import Logo from "../components/Logo/Logo";

import classes from "./App.module.css";

class App extends Component {
	render() {
		return (
			<div className={classes.App}>
				<Logo />
				<Autosuggest
					debounce={500} // Time required to make the request after user has stopped typing (in ms)
				/>
			</div>
		);
	}
}

export default App;
