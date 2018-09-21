'use strict';

import Select from './select.js';
import Rotate from './rotate.js';
import Move from './move.js';
import Scale from './scale.js';

export default function Behavior(mode) {
	const modes = {
		select: Select(),
		move: Move(),
		rotate: Rotate(),
		scale: Scale(),
	};

	const behavior = mode.map((value) => {
		if (!modes.hasOwnProperty(value)) throw new Error('Mode doesn\'t exist');
		return modes[value];
	});

	return behavior;
}
