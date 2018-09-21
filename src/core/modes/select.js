import Mode from './mode.js';

export default function Select() {
	return Object.assign({}, Mode(), {
		mouseMove,
	});
}

function mouseMove() {
	console.log('Select');
}
