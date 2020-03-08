/* A class to simulate a Mars rover */
function Rover (grid) {

	/****************** Properties ******************/

	/* Pulls from constructor parameters */
	this.grid = {
		x: grid.x,
		y: grid.y
	}

	/* Initialize position and heading */
	this.x = 0;
	this.y = 0;
	this.z = 0;

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
		let positionResult = this.isInBounds(x, y);

		if (!positionResult.isValid) {
			return false;
		}
		else {
			this.x = x;
			this.y = y;
			this.z = z;
			this.degrees = this.directions[this.z];
			console.log(`starting at: ${this.x} ${this.y} ${this.z}`);
			return true;
		}


	}

	this.isInBounds = function (x, y) {
		let positionResult = {
			isValid: true,
			message: ''
		};

		if (x < 0 || this.grid.x < x ||
			y < 0 || this.grid.y < y) {
			positionResult.isValid = false;
			positionResult.message = `out of bounds at ${x} ${y} ${this.z}`
		}

		return positionResult;
	}

	this.readMovements = function (movements) {

		console.log('reading movements: ' + movements);

		let result = '';
		let valid = true;
		let triedPosition = {};

		for (const char of movements) {
			switch (char) {
				case 'l':
					this.turn('l');
					break;
				case 'r':
					this.turn('r');
					break;
				case 'm':
					triedPosition = this.move();

					if (!triedPosition.isValid) {
						inBounds = false;
						return `Rover moving out of bounds, stopped at ${this.x} ${this.y} ${this.z}`;
					}
					break;
				default:
					result = `Invalid movement command "${char}"`;
			}
		}

		result = `Final position ${this.x} ${this.y} ${this.z}`;

		return result;
	}

	/* Move one point in the current direction */
	this.move = function () {

		/* Figure out how to move in x and y. Finding the sine of the current heading gives you x, and cosine gives you how to move in y */
		let x = Math.round(Math.sin( this.degToRad() ));
		let y = Math.round(Math.cos( this.degToRad() ));

		let newX = this.x + x;
		let newY = this.y + y;
		let triedPosition = this.isInBounds(newX, newY);

		if (triedPosition.isValid) {
			this.x = newX;
			this.y = newY;
		}

		console.log('new position: ' + this.x + this.y);
		return triedPosition;
	};

	/* Convert heading in degrees to radians */
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

		console.log('new direction: ' + this.z);

	};

	/*  Make sure degrees stays between 0 and 359 to make converting back to direction names easier */
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

/* Clears any error messages from previous transmissions in the UI */
function reset() {
	let errors = select('.error, #results');
	for (let i=0; i< errors.length; i++) {
		errors[i].innerHTML = '';
	}
}


/* Selects the specified DOM element(s). Makes it so you don't have to use querySelector or getElementById/Class constantly, similar to using jQuery */
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
	}

	return finalSelection;
}


/* Get the input value of a form field */
function getValue (selector) {
	let val = select(selector).value;
	if (val == null) {
		console.error(`${selector} has no value attribute!`);
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

function printResult(roverNum, result) {
	select('#results').innerHTML += `<p>Rover ${roverNum}: <span class="uppercase">${result}</span></p>`;
}



/****************** Validation functions ******************/

/* Make sure string is in correct format */
function isValidString(str, regex) {
	return new RegExp(regex).test(str);
}


/* Check if Line 1 is separated by spaces */
function isLine1CorrectFormat (lineNum, line1) {

	if (!isValidString(line1, /^\d+ \d+ [nesw]$/)) {
		addInstrError(lineNum, 'formatting', line1, 'Should be 2 numbers and a direction name (N, E, S, or W), separated by spaces.');
		return false;
	}
	else {
		console.log(line1.split(' '));
		return line1.split(' ');
	}
}

/* Check if Line 2 is separated by spaces */
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
	let instructionLines = instructionsRaw.trim().toLowerCase().split('\n');
	console.log(instructionLines);
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
		console.log('current line: ', currentLine);
		let lineNum = i + 1;

		/* Validate Line 1 */
		if (i  % 2 == 0) {
			instrLine1 = currentLine;
			
			splitLine1 = isLine1CorrectFormat(lineNum, instrLine1);
			console.log('splitLine1: '); 
			console.log(splitLine1); 

			if (!splitLine1) {
				noErrors = false;
				continue;
			}
		}
		/* Validate Line 2 */
		else if (i % 2 == 1) {
			line2 = '';

			instrLine2 = currentLine.replace(/\s/g, '');
			line2 = isLine2CorrectFormat(lineNum, instrLine2);
				console.log('line 2: ' + line2);

			if (!line2) {
				noErrors = false;
			}

			if (!noErrors) {
				instrSet = null;
			}
			else {
				instrSet = {};
				instrSet.x = parseInt(splitLine1[0]);
				console.log(splitLine1);
				instrSet.y = parseInt(splitLine1[1]);
				instrSet.z = splitLine1[2];
				instrSet.movements = line2;
			}
				console.log(JSON.stringify(instrSet));
				parsedInstructions.push(instrSet);
		}
		noErrors = true;
		instrSet = null;
	}

	console.log('Instructions: ' + JSON.stringify(parsedInstructions));
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

		console.log(grid.x + ' ' + grid.y);

		if (grid.x > 0 || grid.y > 0 ) {
			instructionsRaw = getValue('#instructions');
		}


		instructions = parseInstructions(instructionsRaw, grid);

		for (let i=0; i<instructions.length; i++) {
			let instrSet = instructions[i];
			console.log(JSON.stringify(instrSet));

			let roverNum = i + 1;
			let rover = new Rover(grid);
			let result = '';

			if (instrSet == null) {
				printResult(roverNum, 'Invalid input');
			}
			else {
				let isStarted = rover.startAt(instrSet.x, instrSet.y, instrSet.z);
				let lineNum = (2 * roverNum) + 1;

				if (!isStarted) {
					addInstrError(lineNum, 'starting coordinates', `${instrSet.x} ${instrSet.y}`, 'Must be between 0 and the length/width of the grid');
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

