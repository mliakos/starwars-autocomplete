import React from "react";
import PropTypes from "prop-types";

import classes from "./Result.module.css";

const Result = props => {
	/* Event listeners are attached to every <li> element. 
	A main listener for event delegation on the <ul is not needed, 
	since React does this optimization step automatically. */

	const resultClasses = `${classes.Result} ${
		props.highlighted ? classes.highlightedResult : null
	}`;

	return (
		<li
			className={resultClasses}
			data-id={props["data-id"]}
			onMouseDown={props.handleMouseDown}
			onMouseOver={props.handleMouseOver}
		>
			<div className={classes.title}>{props.children}</div>
			<div>
				<span className={classes.property}>height: {props.height} cm</span>
				<span className={classes.property}>mass: {props.mass} kg</span>
				<span className={classes.property}>hair color: {props.hairColor}</span>
				<span className={classes.property}>skin color: {props.skinColor}</span>
				<span className={classes.property}>eye color: {props.eyeColor}</span>
				<span className={classes.property}>birth year: {props.birthYear}</span>
				<span className={classes.propertyNoBorder}>gender: {props.gender}</span>
			</div>
		</li>
	);
};

Result.propTypes = {
	points: PropTypes.number,
	author: PropTypes.string,
	commentsNum: PropTypes.number,
	"data-id": PropTypes.string,
	highlighted: PropTypes.bool,
	handleMouseDown: PropTypes.func,
	handleMouseOver: PropTypes.func
};

export default Result;
