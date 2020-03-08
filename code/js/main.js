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

	/*console.log(`creating Rover at ${this.x}, ${this.y}, ${this.z}`);*/

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

		/*if (x < 0 || this.grid.x < x) {
			console.log('x out of bounds');
			positionResult.isValid = false;
			positionResult.errorAtX = x;
		}
		
		if (y < 0 || this.grid.y < y) {
			console.log('y out of bounds');
			positionResult.isValid = false;
			positionResult.errorAtY = y;
		}*/

		if (x < 0 || this.grid.x < x ||
			y < 0 || this.grid.y < y) {
			positionResult.isValid = false;
			positionResult.message = `out of bounds at ${x} ${y} ${this.z}`
		}

		return positionResult;


		/*if (coordinate < 0 || this.grid[coordinate] < coordinate) {
			return false;
		}
		else {
			return true;
		}*/
	}

	this.readMovements = function (movements) {
		/*let movements = movementsRaw.toLowerCase();*/

		console.log('reading movements: ' + movements);

		let result = '';
		let valid = true;
		let triedPosition = {};

		for (const char of movements) {
			/*inBounds = true;

			if (inBounds) {*/
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
			/*}
			else {
			}*/
		}

		/*if (!valid) {
			result = 'Invalid input';
		}
		else {
			result = this.roverToNasa();
		}*/

		result = `Final position ${this.x} ${this.y} ${this.z}`;

		return result;
	}

	/* Move one point in the current direction */
	this.move = function () {
		console.log('moving');

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
		/*else {
			alert('Invalid direction!');
		}*/

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


	/* Transmit new position and heading back to NASA */
	/*this.roverToNasa = function (message) {
		return message;
	};*/
}






/****************** UI functions ******************/

/* Clears any error messages from previous transmissions in the UI */
function reset() {
	let errors = select('.error, #results');
	for (let i=0; i< errors.length; i++) {
		errors[i].innerHTML = '';
	}

	/*select('#results').innerHTML = '';*/
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

/*function isInBounds( {

	}lineNum, x, y, grid) {
	let hasErrors = false;

	if (x < 0 || grid.x < x) {
		addInstrError(lineNum, 'X coordinate', x, `Must be between 0 and ${grid.x}.`);
		hasErrors = true;
	}
	
	if (y < 0 || grid.y < y) {
		addInstrError(lineNum, 'Y coordinate', y, `Must be between 0 and ${grid.y}.`);
		hasErrors = true;
	}



	return hasErrors ? false : true;
}*/


/* Check if Line 1 is separated by spaces */
function isLine1CorrectFormat (lineNum, line1) {

	/*if (splitLine.length <= 1) {
		addInstrError(lineNum, 'positioning', line1, 'Make sure coordinates are separated by spaces.');
		return false;
	}
	else {
		return splitLine;
	}*/

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


/* Check if Line 1 initial position entries are valid */
/*function isInitXYValid (lineNum, splitLine, grid) {
	let initialPosition = {};
	/*let x = ;
	let y = splitLine[1];
	let z = splitLine[1];

	if (!splitLine) {
		return false;
	}

	initialPosition.x = parseInt(splitLine[0]);
	initialPosition.y = parseInt(splitLine[1]);
	initialPosition.z = splitLine[2];


	if (!isInBounds( {

	}lineNum, initialPosition.x, initialPosition.y, grid)) {
		return false;
	}
	else {
		return initialPosition;
	}
}*/


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

		/*************** Validate Line 1 **************/
		if (i  % 2 == 0) {
			instrLine1 = currentLine;
			
			splitLine1 = isLine1CorrectFormat(lineNum, instrLine1);
			console.log('splitLine1: '); 
			console.log(splitLine1); 
			/*initialPosition = isInitXYValid(lineNum, splitLine1, grid);*/

			if (!splitLine1 /*|| !initialPosition*/ ) {
				noErrors = false;
				continue;
			}
		}
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


	/* Check if separated by spaces */
	/* - If not, add error */
	/* - If so, split at spaces */


	/* Check if first character is a number */
	/* - If not, add error */
	/* - If so, check if it's between 0 and grid bound x */
	/* 		- If not, add error */
	/*		- If so, add it to temp obj x */

	/* Check if second character is a number */
	/* - If not, add error */
	/* - If so, check if it's between 0 and grid bound x */
	/* 		- If not, add error */
	/*		- If so, add it to temp obj y */

	/* Check if third character is n,e,s,w */
	/* - If not, add error */
	/* - If so, add it to temp obj z */




	/*************** Line 2 **************/

	/* Check if line 2 is l,r,m */
	/* - If not, add error */
	/* - If so, add it to temp obj movement */



	/* If no errors, push the temp obj to the instruction array */
	/* If errors, push a null */





/*
	for (let i=0; i<instructionLines.length; i++) {
		if (i  % 2 == 0) {

		}
		else if (i % 2 == 1) {

		}
	}*/




	/*for (let i=0; i<instructionLines.length; i++) {
		let currentLine = instructionLines[i];
		let instrLine1 = [];
		let instrLine2 = '';

		if (i  % 2 == 0) {
			
			instrSet = {};
			instrLine1 = currentLine.split(' ');
			instrSet.x = parseInt(instrLine1[0]);
			instrSet.y = parseInt(instrLine1[1]);
			instrSet.z = instrLine1[2].toLowerCase();

			if ( isNaN(instrSet.x)) {
				instructionError += `Invalid X coordinate: ${instrLine1[0]}<br>`;
				noErrors = false;
			}
			
			if ( isNaN(instrSet.y)) {
				instructionError += `Invalid Y coordinate: ${instrLine1[1]}<br>`;
				noErrors = false;
			}


			let zIsValid = new RegExp(regex/.test[nesw]+/).test(instrSet.z);

			if ( !zIsValid ) {
				instructionError += `Invalid heading: ${instrLine1[2]}<br>`;
				noErrors = false;
			}

		}
		else if (i % 2 == 1) {

			instrLine2 = currentLine.toLowerCase();

			let mIsValid = new RegExp(/[lrm]+/).test(instrLine2);

			console.log(instrLine2);

			if (!mIsValid) {
				instructionError += `Invalid movement instructions: ${instrLine2}<br>`;
				noErrors = false;
			}
			else {
				instrSet.movements = instrLine2;
			}

			instructions.push(instrSet);
			console.log('Instruction set: ' + JSON.stringify(instrSet));
			
		}


	}


		
	if (!noErrors) {
		showError('#instructions', instructionError);
		return;
	}
	else {
		console.log('Instructions: ' + JSON.stringify(instructions));
		return instructions;
	}*/
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



			/*addInstrError(lineNum, 'X coordinate', x, `Must be between 0 and ${grid.x}.`);*/

				printResult(roverNum, result);
			}

		}
		


	});

}


document.addEventListener('DOMContentLoaded', main);

