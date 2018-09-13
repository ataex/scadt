'use strict';

import gm from '../engine/graphics-math.js';
export default function Behavior(mode) {
	const modes = {
		select: Select(),
		move: Move(),
		rotate: Rotate(),
	};

	const behavior = mode.map((value) => {
		if (!modes.hasOwnProperty(value)) throw new Error('Mode doesn\'t exist');
		return modes[value];
	});

	return behavior;
}

function iBehavior() {
	return {
		mouseDown() {},
		mouseUp() {},
		mouseMove() {},
		mouseMovePair() {},
		wheel() {},
	};
}

export function Select() {
	return Object.assign({}, iBehavior(), {
		mouseMove() {
			console.log('Select');
		},
	});
}

export function Move() {
	let foo = gm.v3.init();
	return Object.assign({}, iBehavior(), {
		mouseDown(e) {
			const picked = this.engine.pick(this.scene, e);
			if (picked) {
				picked.select();
				this.temp(picked);

				const r = this.mousePlaneProjection(
					e,
					this.engine.viewController.getOppositeBasePlane(),
					picked.position
				);
				gm.v3.subtract(foo, r, picked.orient());
			}
		},

		mouseUp() {
			const picked = this.temp();
			if (picked) {
				this.temp().selected = false;
				this.temp(undefined);
			}
		},
		mouseMove(e) {
			const picked = this.temp();
			if (picked) {
				const r = this.mousePlaneProjection(
					e,
					this.engine.viewController.getOppositeBasePlane(),
					picked.position
				);
				gm.v3.subtract(r, r, foo);
				picked.move(r);
			}
		},
	});
}

export function Rotate() {
	let origin;
	let oldAngle;

	return Object.assign({}, iBehavior(), {
		mouseDown(e) {
			const picked = this.engine.pick(this.scene, e);
			if (picked) {
				origin = this.engine.viewController.project(picked.orient());
				const dir = [e.clientX - origin[0], e.clientY - origin[1]];
				oldAngle =
					Math.atan(dir[1] / dir[0]) +
					(dir[0] < 0 ? 3.14159 : dir[1] < 0 ? 6.28318 : 0);

				picked.select();
				this.temp(picked);

				const r = this.mousePlaneProjection(
					e,
					this.engine.viewController.getOppositeBasePlane(),
					picked.position
				);
			}
		},
		mouseUp() {
			const picked = this.temp();
			if (picked) {
				this.temp().selected = false;
				this.temp(undefined);
			}
		},

		mouseMove(e) {
			const picked = this.temp();
			if (picked) {
				const nir = [e.clientX - origin[0], e.clientY - origin[1]];
				/*
				let angle = Math.acos(
					(dir[0] * nir[0] + dir[1] * nir[1]) /
						(Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1]) *
							Math.sqrt(nir[0] * nir[0] + nir[1] * nir[1]))
				);
				*/
				let angle =
					Math.atan(nir[1] / nir[0]) +
					(nir[0] < 0 ? 3.14159 : nir[1] < 0 ? 6.28318 : 0);
				const plane = this.engine.viewController.getOppositeBasePlane();
				picked.rotate(plane, oldAngle - angle);
				oldAngle = angle;
			}
		},
	});
}
