import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useDebounce from "../../hooks/useDebounce";

import Input from "./Input/Input";
import Results from "./Results/Results";
import Button from "./Button/Button";
import InfoArea from "./InfoArea/InfoArea";

import classes from "./Autosuggest.module.css";

const Autosuggest = props => {
	const [highlightedID, setHighlightedID] = useState("");
	const [displayResults, setDisplayResults] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedHero, setSelectedhero] = useState({});

	/* 
	Debouncing the search query, will effectively return the same value each time
	so no requests will be made. The new value will be returned only if certain time
	has passed. 
	*/

	const debouncedInputValue = useDebounce(inputValue, props.debounce);

	// Hook to make API calls when debounced value changes
	useEffect(() => {
		const fetchResults = async () => {
			let canceled = false;

			// Initially try to fetch from cache
			try {
				const cached = JSON.parse(
					localStorage.getItem(`${debouncedInputValue}`)
				);
				setData([...cached]);
			} catch (e) {
				setLoading(true);

				try {
					// Fetching data
					const response = await fetch(
						`https://swapi.dev/api/people/?search=${debouncedInputValue}`
					);

					// Parsing response
					const data = await response.json();

					// Caching data
					localStorage.setItem(
						debouncedInputValue,
						JSON.stringify(data.results)
					);

					// Preventing race condition by canceling stale requests
					if (!canceled) {
						setData(data.results);
						setLoading(false);
					}
				} catch (e) {
					alert(e);
					setLoading(false);
				}
			}

			return () => (canceled = true);
		};

		(async () => {
			// Fetch data
			if (debouncedInputValue.length) {
				fetchResults();
			}
		})();
	}, [debouncedInputValue]);

	// Hook to manage results container display when input value changes
	useEffect(() => {
		//  Hide results on empty input
		if (!inputValue.length && displayResults) {
			toggleResults();
		}

		//  Display results on input
		if (inputValue.length && !displayResults) {
			toggleResults();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputValue]);

	/*** Handler functions ***/

	const handleInputKeyDown = event => {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			if (!displayResults) {
				toggleResults();
			} else {
				changeSelection("inc");
			}
		}

		if (event.key === "ArrowUp") {
			event.preventDefault();
			if (!displayResults) {
				toggleResults();
			} else {
				changeSelection("dec");
			}
		}

		if (event.key === "Escape") {
			if (displayResults) toggleResults();
		}

		if (event.key === "Enter") {
			if (displayResults && highlightedID) {
				loadHighlightedHero();
				toggleResults();
			}
		}
	};

	// Updates highlighted result ID in state
	const handleResultMouseOver = event => {
		const targetID = event.target.closest("li").getAttribute("data-id");

		if (highlightedID !== targetID) setHighlightedID(targetID);
	};

	const handleResultMouseDown = event => loadHighlightedHero();

	// Updates state on input change
	const handleInputChange = event => {
		setInputValue(event.target.value);
	};

	// Hides results container on input blur
	const handleInputBlur = () => (displayResults ? toggleResults() : null);

	// Displays results container on input focus if input value > 3
	const handleInputFocus = () =>
		!displayResults && inputValue.length && data.length
			? toggleResults()
			: null;

	/*** Other functions ***/

	const loadHighlightedHero = () => {
		console.log("s");
		const highlightedElementIndex = data.findIndex(
			e => e.name === highlightedID
		);

		setSelectedhero(data[highlightedElementIndex]);
	};

	const changeSelection = mode => {
		// Currently highlighted result index in state object
		const highlightedElementIndex = data.findIndex(
			e => e.name === highlightedID
		);

		// Increment selection
		if (mode === "inc") {
			if (highlightedElementIndex < data.length - 1) {
				const targetID = data[highlightedElementIndex + 1].name;

				setHighlightedID(targetID);
			}
		}

		// Decrement selection
		if (mode === "dec") {
			if (highlightedElementIndex > 0) {
				const targetID = data[highlightedElementIndex - 1].name;

				setHighlightedID(targetID);
			}
		}
	};

	const toggleResults = () => {
		setDisplayResults(!displayResults);
	};

	/*** Rendering ***/

	// Conditionally show results based on state and input value
	const results = displayResults ? (
		<Results
			data={data}
			highlightedID={highlightedID}
			handleMouseDown={handleResultMouseDown}
			handleMouseOver={handleResultMouseOver}
		/>
	) : null;

	// Conditionally render search button text to indicate loading
	const buttonText = loading ? "Loading..." : "SEARCH";

	// Conditionally disable search button
	const disabledSearch = data.length < 3 || inputValue.length < 3;

	return (
		<div className={classes.Autosuggest}>
			<div style={{ textAlign: "left" }}>
				<label style={{ fontSize: "0.75em", display: "block" }}>Search</label>

				<Input
					handleKeyDown={event => handleInputKeyDown(event, highlightedID)}
					handleBlur={handleInputBlur}
					handleFocus={handleInputFocus}
					handleChange={handleInputChange}
					inputValue={inputValue}
				></Input>

				<Button disabledSearch={disabledSearch}>{buttonText}</Button>

				{results}
				<InfoArea heroObject={selectedHero} />
			</div>
		</div>
	);
};

Autosuggest.propTypes = {
	minChars: PropTypes.number,
	debounce: PropTypes.number
};

export default Autosuggest;
