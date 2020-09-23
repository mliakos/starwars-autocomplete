import React from "react";
import PropTypes from "prop-types";

import classes from "./Button.module.css";

const Button = props => (
	<button disabled={props.disabledSearch} className={classes.Button}>
		{props.children}
	</button>
);

Button.propTypes = {
	disabledSearch: PropTypes.bool
};

export default Button;
