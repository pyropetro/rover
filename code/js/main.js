/* A class to simulate a Mars rover */
function Rover (x, y, z) {

	/****************** Properties ******************/

	/* Position and heading */
	this.x = x;
	this.y = y;
	this.z = z;

	console.log(`creating Rover at ${this.x}, ${this.y}, ${this.z}`);

	/* Enable rover to look up degree equivalent of heading */
	this.directions = {
		n: 0,
		e: 90,
		s: 180,
		w: 270
	};

	/* Heading in degrees */
	this.degrees = this.directions[this.z];

	this.turnIncrement = 90;
	this.fullTurn = 360;



	/******************* Methods *******************/

	this.readMovements = function (m) {
		let movements = m.toLowerCase();
		console.log('reading movements: ' + movements);

		let result = '';
		let valid = true;

		for (const char of movements) {
			switch (char) {
				case 'l':
					this.turn('l');
					break;
				case 'r':
					this.turn('r');
					break;
				case 'm':
					this.move();
					break;
				default:
					valid = false;
			}
		}

		if (!valid) {
			result = 'Invalid input';
		}
		else {
			result = this.roverToNasa();
		}
		return result;
	}

	/* Move one point in the current direction */
	this.move = function () {
		console.log('moving');

		/* Figure out how to move in x and y. Finding the sine of the current heading gives you x, and cosine gives you how to move in y */
		let x = Math.round(Math.sin( this.degToRad() ));
		let y = Math.round(Math.cos( this.degToRad() ));

		this.x += x;
		this.y += y;
		console.log('new position: ' + this.x + this.y);
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
	this.roverToNasa = function () {
		let result = `${this.x} ${this.y} ${this.z}`;

		return result;
	};
}






/****************** Main functions ******************/

/* Clears any error messages from previous transmissions in the UI */
function reset() {
	let errors = select('.error');
	for (let i=0; i< errors.length; i++) {
		errors[i].innerHTML = '';
	}

	select('#results').innerHTML = '';
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


/* Make sure string is in correct format */
function isValidString(str, regex) {
	return new RegExp(regex).test(str);
}


/* Show an error message in the UI */
function showError(selector, message) {
	select(`${selector} ~ .error`).innerHTML = message;
}


/* Separate the raw input from the instructions field into commands to pass to the appropriate rover */
function parseInstructions (instructionsRaw) {
	let instructions = [];
	let instructionLines = instructionsRaw.trim().split('\n');
	let instrSet = {};
	let instructionError = '';
	let noErrors = true;

	/* Make sure each rover has 2 lines of instructions */
	if (instructionLines.length % 2 != 0) {
		showError('#instructions', 'Each rover should be given 2 lines of instructions.');
		return;
	}


	/*************** Line 1 **************/

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

		grid.x = getNum('#area-x');
		grid.y = getNum('#area-y');

		console.log(grid.x + ' ' + grid.y);

		if (grid.x > 0 || grid.y > 0 ) {
			instructionsRaw = getValue('#instructions');
		}


			instructions = parseInstructions(instructionsRaw);

			for (let i=0; i<instructions.length; i++) {
				let instrSet = instructions[i];
				let rover = new Rover(instrSet.x, instrSet.y, instrSet.z);
				let result = rover.readMovements(instrSet.movements);

				select('#results').innerHTML += `Rover ${i + 1}: <span class="uppercase">${result}</span><br>`;
			}
		}


	});

}


document.addEventListener('DOMContentLoaded', main);

