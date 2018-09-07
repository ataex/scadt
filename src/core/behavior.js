function Behavior() {
	return {
		mouseDown() {},
		mouseUp() {},
		mouseMove() {},
		mouseWheel() {},
	};
}

export function Select() {
	return Object.assign({}, Behavior(), {
		mouseMove() {
			console.log('Select');
		},
		mouseUp(e) {
			this.engine.select(this.scene, e);
		},
	});
}

export function Move() {
	return Object.assign({}, Behavior(), {
		mouseMove() {
			console.log('Move');
		},
		mouseUp(e) {
			this.engine.select(this.scene, e);
		},
	});
}
