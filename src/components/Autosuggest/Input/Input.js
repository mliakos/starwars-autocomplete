import React from "react";
import PropTypes from "prop-types";

import classes from "./Input.module.css";

const Input = props => {
	return (
		<input
			onKeyDown={props.handleKeyDown}
			onBlur={props.handleBlur}
			onFocus={props.handleFocus}
			onChange={props.handleChange}
			className={classes.Input}
			value={props.inputValue}
		></input>
	);
};

Input.propTypes = {
	handleKeyDown: PropTypes.func,
	handleBlur: PropTypes.func,
	handleFocus: PropTypes.func,
	handleChange: PropTypes.func,
	inputValue: PropTypes.string
};

export default Input;
