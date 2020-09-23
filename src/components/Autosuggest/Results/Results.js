import React from "react";
import Result from "./Result/Result";

import PropTypes from "prop-types";

import classes from "./Results.module.css";

const Results = props => {
	let container;

	if (props.data.length) {
		const results = props.data.map(result => {
			const highlighted = result.name === props.highlightedID;

			return (
				<Result
					height={result.height}
					mass={result.mass}
					hairColor={result.hair_color}
					skinColor={result.skin_color}
					eyeColor={result.eye_color}
					birthYear={result.birth_year}
					gender={result.gender}
					key={result.name}
					data-id={result.name}
					highlighted={highlighted}
					handleMouseDown={props.handleMouseDown}
					handleMouseOver={props.handleMouseOver}
				>
					{result.name}
				</Result>
			);
		});

		container = <ul className={classes.Results}>{results}</ul>;
	} else {
		container = (
			<span>
				<small>No results.</small>
			</span>
		);
	}
	return container;
};

Results.propTypes = {
	data: PropTypes.array,
	highlightedID: PropTypes.string,
	handleClick: PropTypes.func,
	handleMouseOver: PropTypes.func
};

export default Results;
