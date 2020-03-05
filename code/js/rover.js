export function Rover (x, y, z) {

	/****************** Properties ******************/

	/* Position and heading */
	this.x = x;
	this.y = y;
	this.z = z;

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

	/* Move one point in the current direction */
	this.move = function () {

		/* Figure out how to move in x and y */
		let x = Math.sin( this.degToRad() );
		let y = Math.cos( this.degToRad() );

		this.x += x;
		this.y += y;
	}

	/* Convert heading in degrees to radians */
	this.degToRad = function () {
		return this.degrees * ( Math.PI / 180 );
	}

	/* Turn 90 degrees to the left or right */
	this.turn = function (direction) {

		if (direction == 'L') {
			this.degrees -= this.turnIncrement;
		}
		else if (direction == 'R') {
			this.degrees += this.turnIncrement;
		}
		else {
			alert('Invalid direction!');
		}

		this.normalizeDirection();
		this.updateDirection();

	}

	/*  Make sure degrees stays between 0 and 359 */
	this.normalizeDirection = function () {
		if (this.degrees < 0) {
			this.degrees += this.fullTurn;
		}
		else if (this.degrees >= this.fullTurn) {
			this.degrees -= this.fullTurn;
		}
	}

	/* Find out which direction is being faced. North is assumed to be 0 degrees */
	this.updateDirection = function () {

		/* An array of all the direction names */
		let dirs = Object.keys(this.directions);

		/* Looks up which direction name is associated with the direction in degrees */
		let dirFound = dirs.find(key => this.directions[key] == this.degrees);

		this.z = dirFound;
	}


	/* Transmit new position and heading back to NASA */
	this.update = function () {

		return `${this.x}
				${this.y}
				${this.z}`;
	}
}