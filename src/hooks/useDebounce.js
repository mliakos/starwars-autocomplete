import { useState, useEffect } from "react";

const useDebounce = (value, delay) => {
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(() => {
		// Set debouncedValue after the specified delay
		const handler = setTimeout(() => setDebouncedValue(value), delay);

		/*
		Timeout is restarted each time this hook is called to prevent
		value from changing within the delay period.
		*/
		return () => clearTimeout(handler);
	}, [value, delay]);

	return debouncedValue;
};

export default useDebounce;
