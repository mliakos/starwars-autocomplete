const fs = require("fs");

const mockData = JSON.parse(
	fs.readFileSync("./tests_setup/mockData.json", {
		encoding: "utf-8"
	})
);

/* Puppeteer Tests */

let page, context;

/* Preparation and cleanup work */
beforeEach(async done => {
	// Using different contexts instead of spinning up new browser instances for increased performance
	context = await global.__BROWSER__.createIncognitoBrowserContext();
	page = await context.newPage();
	await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

	// Mock API calls by replacing fetch method
	await page.evaluate(mockData => {
		window.fetch = () => {
			return Promise.resolve({
				json: () => Promise.resolve(mockData)
			});
		};
	}, mockData);

	done();
});

afterEach(async done => {
	await page.close();
	await context.close();
	done();
});

describe("<Result />", () => {
	it("should be selected when clicking (on mousedown)", async () => {
		await page.type("input", "dar");

		await page.waitForSelector("li");

		expect(
			await page.evaluate(() => {
				// Creating mouseover event
				const mouseOverEvent = new MouseEvent("mouseover", {
					bubbles: true
				});

				// Creating mousedown event
				const mouseDownEvent = new MouseEvent("mousedown", {
					bubbles: true
				});

				// Getting first result
				const result = document.querySelector("li");

				// Dispatching mouseover event (hovering)
				result.dispatchEvent(mouseOverEvent);

				// Dispatching mousedown event (clicking)
				result.dispatchEvent(mouseDownEvent);

				// Getting first result
				const selectedHero = document.querySelector(
					"table > tbody > tr > td > strong"
				);

				// Getting selected hero
				return selectedHero.textContent;
			})
		).toEqual(mockData.results[0].name);
	});

	it("should be selected when pressing enter", async () => {
		await page.type("input", "dar");

		await page.waitForSelector("li");

		expect(
			await page.evaluate(() => {
				// Creating mouseover event
				const mouseOverEvent = new MouseEvent("mouseover", {
					bubbles: true
				});

				// Creating enter event
				const enterEvent = new KeyboardEvent("keydown", {
					key: "Enter",
					bubbles: true
				});

				// Getting first result
				const result = document.querySelector("li");

				const input = document.querySelector("input");

				// Dispatching mouseover event (hovering)
				result.dispatchEvent(mouseOverEvent);

				// Dispatching enter event
				input.dispatchEvent(enterEvent);

				// Getting first result
				const selectedHero = document.querySelector(
					"table > tbody > tr > td > strong"
				);

				// Getting selected hero
				return selectedHero.textContent;
			})
		).toEqual(mockData.results[0].name);
	});

	it("should be highlighted when being hovered over", async () => {
		await page.type("input", "dar");

		await page.waitForSelector("li");

		expect(
			await page.evaluate(() => {
				// Creating mouseover event
				const mouseOverEvent = new MouseEvent("mouseover", {
					bubbles: true
				});

				// Getting first result
				const result = document.querySelector("li");

				// Dispatching mouseover event (hovering)
				result.dispatchEvent(mouseOverEvent);

				// Checking if it is highlighted by evaluating class name string
				return result.className.includes("highlightedResult");
			})
		).toBeTruthy();
	});
});

describe("<Results />", () => {
	it("should successfully switch between results on arrow up and down", async () => {
		await page.type("input", "dar");

		await page.waitForSelector("li");

		expect(
			await page.evaluate(() => {
				// Creating arrow down event
				const arrowDownEvent = new KeyboardEvent("keydown", {
					key: "ArrowDown",
					bubbles: true
				});

				// Creating arrow up event
				const arrowUpEvent = new KeyboardEvent("keydown", {
					key: "ArrowUp",
					bubbles: true
				});

				// Getting all results
				const results = document.querySelectorAll("li");

				const input = document.querySelector("input");

				// Testing arrow down on every result
				for (let i = 0; i < results.length; i++) {
					input.dispatchEvent(arrowDownEvent);

					const currentlyHighlightedResult = document.querySelector(
						"li[class*='highlighted']"
					);

					// Make sure that the correct result is highlighted
					if (
						!(currentlyHighlightedResult.textContent == results[i].textContent)
					) {
						return false;
					}
				}

				// Testing arrow up for every result
				for (let i = results.length - 1; i > 0; i--) {
					input.dispatchEvent(arrowUpEvent);

					const currentlyHighlightedResult = document.querySelector(
						"li[class*='highlighted']"
					);

					// Make sure that the correct result is highlighted
					if (
						!(
							currentlyHighlightedResult.textContent ==
							results[i - 1].textContent
						)
					) {
						return false;
					}
				}

				return true;
			})
		).toBeTruthy();
	});

	it("should be invisible on input blur", async () => {
		await page.type("input", "dar");

		await page.waitForSelector("li");

		await page.evaluate(() => {
			// Creating blur event
			const blurEvent = new Event("blur");

			// Creating focus event
			const focusEvent = new Event("focus");

			const input = document.querySelector("input");

			input.dispatchEvent(focusEvent);
			input.dispatchEvent(blurEvent);
		});

		expect(await page.$("ul")).toBeFalsy();
	});

	it("should be invisible when pressing escape key", async () => {
		await page.type("input", "dar");

		await page.waitForSelector("li");

		await page.evaluate(() => {
			// Creating enter event
			const escapeEvent = new KeyboardEvent("keydown", {
				key: "Escape",
				bubbles: true
			});

			const input = document.querySelector("input");

			input.dispatchEvent(escapeEvent);
		});

		expect(await page.$("ul")).toBeFalsy();
	});

	it("should be visible on input focus", async () => {
		await page.type("input", "dar");

		await page.waitForSelector("li");

		await page.evaluate(() => {
			// Creating blur event
			const blurEvent = new Event("blur");

			// Creating focus event
			const focusEvent = new Event("focus");

			const input = document.querySelector("input");

			input.dispatchEvent(blurEvent);
			input.dispatchEvent(focusEvent);
		});

		expect(await page.$("ul")).toBeTruthy();
	});
});

describe("<InfoArea />", () => {
	it("should display correct data", async () => {
		await page.type("input", "dar");

		await page.waitForSelector("li");

		const result = await page.evaluate(mockData => {
			/* Selecting first result */

			// Creating mouseover event
			const mouseOverEvent = new MouseEvent("mouseover", {
				bubbles: true
			});

			// Creating enter event
			const enterEvent = new KeyboardEvent("keydown", {
				key: "Enter",
				bubbles: true
			});

			// Getting first result
			const result = document.querySelector("li");

			const input = document.querySelector("input");

			// Dispatching mouseover event (hovering)
			result.dispatchEvent(mouseOverEvent);

			// Dispatching enter event
			input.dispatchEvent(enterEvent);

			/* Evaluating data */

			const name = document.querySelector(
				"table > tbody > tr:nth-child(1) strong"
			).textContent;
			const gender = document.querySelector(
				"table > tbody > tr:nth-child(2) > td:nth-child(2)"
			).textContent;
			const birthYear = document.querySelector(
				"table > tbody > tr:nth-child(3) > td:nth-child(2)"
			).textContent;
			const height = document.querySelector(
				"table > tbody > tr:nth-child(4) > td:nth-child(2)"
			).textContent;
			const mass = document.querySelector(
				"table > tbody > tr:nth-child(5) > td:nth-child(2)"
			).textContent;
			const hairColor = document.querySelector(
				"table > tbody > tr:nth-child(6) > td:nth-child(2)"
			).textContent;
			const skinColor = document.querySelector(
				"table > tbody > tr:nth-child(7) > td:nth-child(2)"
			).textContent;
			const eyeColor = document.querySelector(
				"table > tbody > tr:nth-child(8) > td:nth-child(2)"
			).textContent;

			const heroObject = mockData.results[0];

			return (
				heroObject.name === name &&
				heroObject.gender === gender &&
				heroObject.birth_year === birthYear &&
				heroObject.height === height &&
				heroObject.mass === mass &&
				heroObject.hair_color === hairColor &&
				heroObject.skin_color === skinColor &&
				heroObject.eye_color === eyeColor
			);
		}, mockData);

		expect(result).toBeTruthy();
	});
});
