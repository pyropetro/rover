/* A class to simulate a Mars rover */
function Rover (grid) {

	/****************** Properties ******************/

	/* Pulls from constructor parameters */
	this.grid = {
		x: grid.x,
		y: grid.y
	}

	/* Initialize position and heading */
	this.x;
	this.y;
	this.z;

	/* Heading in degrees */
	this.degrees;

	/* Enable rover to look up degree equivalent of heading */
	this.directions = {
		n: 0,
		e: 90,
		s: 180,
		w: 270
	};

	this.turnIncrement = 90;
	this.fullTurn = 360;



	/******************* Methods *******************/

	/* Initialize rover position */
	this.startAt = function (x, y, z) {

		if (!this.isInBounds(x, y)) {
			return false;
		}
		else {
			this.x = x;
			this.y = y;
			this.z = z;
			this.degrees = this.directions[this.z];
			return true;
		}
	}


	/* Check if x and y coordinates are within the grid bounds (between 0 and the grid length and width respectively) */
	this.isInBounds = function (x, y) {

		if (x < 0 || this.grid.x < x ||
			y < 0 || this.grid.y < y) {
			return false;
		}
		else {
			return true;
		}
	}


	/* Execute movement instructions input by user */
	this.readMovements = function (movements) {

		let roverMoved = false;

		for (const char of movements) {
			switch (char) {
				case 'l':
					this.turn('l');
					break;
				case 'r':
					this.turn('r');
					break;
				case 'm':
					/* Test if moving would take the rover out of bounds. If it does, stop moving and return current position */
					roverMoved = this.move();

					if (!roverMoved) {
						return `Moving out of bounds, stopped at ${this.x} ${this.y} ${this.z}`;
					}
					break;
				default:
					return `Invalid movement command "${char}"`;
			}
		}

		/* If entire line of instructions was executed successfully, return final position */
		return `Final position ${this.x} ${this.y} ${this.z}`;
	}


	/* Move one grid point in the current direction, if it wouldn't take the rover out of bounds */
	this.move = function () {

		/* Figure out how to move in x and y. Finding the sine of the current heading (converted to radians) gives you x, and cosine gives you how to move in y */
		let x = Math.round(Math.sin( this.degToRad() ));
		let y = Math.round(Math.cos( this.degToRad() ));

		/* Test if new position would be in bounds. Rover only actually moves if in bounds. Otherwise it stops */
		let newX = this.x + x;
		let newY = this.y + y;
		let inBounds = this.isInBounds(newX, newY);

		if (inBounds) {
			this.x = newX;
			this.y = newY;
		}

		return inBounds;
	};


	/* Convert heading in degrees to radians - helps figure out how to move on the grid */
	this.degToRad = function () {
		return this.degrees * ( Math.PI / 180 );
	};


	/* Turn 90 degrees to the left or right */
	this.turn = function (direction) {

		if (direction == 'l') {
			this.degrees -= this.turnIncrement;
		}
		else if (direction == 'r') {
			this.degrees += this.turnIncrement;
		}

		this.normalizeDirection();
		this.updateDirection();
	};


	/*  Make sure degrees stay between 0 and 359 to make converting back to direction names easier */
	this.normalizeDirection = function () {
		if (this.degrees < 0) {
			this.degrees += this.fullTurn;
		}
		else if (this.degrees >= this.fullTurn) {
			this.degrees -= this.fullTurn;
		}
	};


	/* Find out which direction is being faced. North is assumed to be 0 degrees */
	this.updateDirection = function () {

		/* An array of all the direction names */
		let dirs = Object.keys(this.directions);

		/* Looks up which direction name is associated with the direction in degrees */
		let dirFound = dirs.find(key => this.directions[key] == this.degrees);

		this.z = dirFound;
	};
}




/****************** UI functions ******************/

/* Clears any messages from previous transmissions in the UI */
function reset() {
	let messages = select('.error, #results');
	for (let i=0; i< messages.length; i++) {
		messages[i].innerHTML = '';
	}
}


/* Selects the specified DOM element(s). Makes it so you don't have to use querySelector or getElementById/Class constantly, similar to using jQuery selection */
function select (selector) {
	let selection = document.querySelectorAll(selector);
	let finalSelection = null;
	
	if (selection.length == 1) {
		finalSelection = selection[0];
	}
	else if (selection.length > 1) {
		finalSelection = selection;
	}
	else {
		console.error(`Invalid selector! ${selector}`);
		return false;
	}

	return finalSelection;
}


/* Get the input value of a form field */
function getValue (selector) {
	let val = select(selector).value;
	if (val == null) {
		console.error(`${selector} has no value attribute!`);
		return false;
	}
	return val;
}


/* Try to parse an input value into an integer */
function getNum(selector) {
	let num = parseInt(getValue(selector));

	if ( isNaN(num) ) {
		showError(selector, 'Please enter a number.');
		return 0;
	}
	else if ( num < 1 ) {
		showError(selector, 'Please enter a positive number.');
		return 0;
	}
	else {
		return num;
	}
}


/* Show an error message in the UI */
function showError(selector, message) {
	select(`${selector} ~ .error`).innerHTML = message;
}


/* Add a line to the instruction errors output in the UI */
function addInstrError(lineNum, elementName, elementVal, message) {
	select('#instructions ~ .error').innerHTML += `<p>Line ${lineNum}: Invalid ${elementName} "${elementVal}." ${message}</p>`;
}


/* Display each rover's final status in the UI */
function printResult(roverNum, result) {
	select('#results').innerHTML += `<p>Rover ${roverNum}: <span class="uppercase">${result}</span></p>`;
}



/****************** Validation functions ******************/

/* Test if a string is in the correct format */
function isValidString(str, regex) {
	return new RegExp(regex).test(str);
}


/* Check if Line 1 contains 2 numbers and a direction name separated by spaces. If it does, split it into individual elements */
function isLine1CorrectFormat (lineNum, line1) {

	if (!isValidString(line1, /^\d+ \d+ [nesw]$/)) {
		addInstrError(lineNum, 'formatting', line1, 'Should be 2 numbers and a direction name (N, E, S, or W), separated by spaces.');
		return false;
	}
	else {
		return line1.split(' ');
	}
}


/* Check if Line 2 is a string only consisting of L, R, and M */
function isLine2CorrectFormat (lineNum, line2) {

	if (!isValidString(line2, /^[lrm]+$/)) {
		addInstrError(lineNum, 'formatting', line2, 'Should be any combination of L, R, and/or M');
		return false;
	}
	else {
		return line2;
	}
}


/* Separate the raw input from the instructions field into commands to pass to the appropriate rover, if valid */
function parseInstructions (instructionsRaw, grid) {

	/* Remove any extra spaces from top or bottom of input, make it all lowercase, split into individual lines */
	let instructionLines = instructionsRaw.trim().toLowerCase().split('\n');

	let instrLine1 = '';
	let splitLine1 = [];
	let instrLine2 = '';
	let instrSet = null;
	let initialPosition = null;
	let noErrors = true;
	let parsedInstructions = [];

	/* Make sure each rover has 2 lines of instructions */
	if (instructionsRaw.length == 0 || instructionLines.length % 2 != 0) {
		showError('#instructions', 'Each rover should be given 2 lines of instructions.');
		noErrors = false;
	}

	for (let i=0; i<instructionLines.length; i++) {
		let currentLine = instructionLines[i];
		let lineNum = i + 1;

		/* Validate Line 1 */
		if (i  % 2 == 0) {
			instrLine1 = currentLine;
			splitLine1 = isLine1CorrectFormat(lineNum, instrLine1);

			if (!splitLine1) {
				noErrors = false;
				continue;
			}
		}
		/* Validate Line 2. If both lines are valid, package them into a set of instructions for a rover */
		else if (i % 2 == 1) {
			line2 = '';

			/* Remove any spaces from line 2 */
			instrLine2 = currentLine.replace(/\s/g, '');
			line2 = isLine2CorrectFormat(lineNum, instrLine2);

			if (!line2) {
				noErrors = false;
			}

			if (!noErrors) {
				instrSet = null;
			}
			else {
				instrSet = {};
				instrSet.x = parseInt(splitLine1[0]);
				instrSet.y = parseInt(splitLine1[1]);
				instrSet.z = splitLine1[2];
				instrSet.movements = line2;
			}

			parsedInstructions.push(instrSet);
		}
		/* Reset variables for the next two lines of input */
		noErrors = true;
		instrSet = null;
	}

	return parsedInstructions;
}



function main () {

	let grid = {
		x: 0,
		y: 0
	}
	let instructionsRaw = '';
	let instructions = {};

	select('#transmit').addEventListener('click', function () {

		reset();

		grid.x = getNum('#grid-x');
		grid.y = getNum('#grid-y');

		if (grid.x > 0 && grid.y > 0 ) {
			instructionsRaw = getValue('#instructions');
		}
		else {
			return;
		}

		instructions = parseInstructions(instructionsRaw, grid);

		/* For each set of instructions, create a new Rover instance and attempt to execute its commands */
		for (let i=0; i<instructions.length; i++) {
			let instrSet = instructions[i];
			let roverNum = i + 1;
			let rover = new Rover(grid);
			let result = '';

			if (instrSet == null) {
				printResult(roverNum, 'Invalid input');
			}
			else {
				let isStarted = rover.startAt(instrSet.x, instrSet.y, instrSet.z);
				let lineNum = (2 * i) + 1;

				if (!isStarted) {
					addInstrError(lineNum, 'starting coordinates', `${instrSet.x} ${instrSet.y}`, 'Must be between 0 and the width/length of the grid');
					result = `Invalid starting coordinates (${instrSet.x}, ${instrSet.y})`
				}
				else {
					result = rover.readMovements(instrSet.movements);
				}

				printResult(roverNum, result);
			}
		}
	});
}


document.addEventListener('DOMContentLoaded', main);

