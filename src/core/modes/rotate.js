'use strict';

import gm from '../../engine/utility/graphics-math.js';
import Mode from './mode.js';

export default function Rotate() {
	let origin;
	let oldAngle;

	return Object.assign({}, Mode(), {
		mouseDown(e) {
			if (e.buttons === 1) {
				const picked = this.engine.pick(this.scene, e);
				if (picked) {
					origin = this.engine.viewController.project(picked.orient());
					const dir = [e.clientX - origin[0], e.clientY - origin[1]];
					oldAngle =
						Math.atan(dir[1] / dir[0]) +
						(dir[0] < 0 ? 3.14159 : dir[1] < 0 ? 6.28318 : 0);

					picked.toggleSelect();
					this.temp(picked);

					const r = this.mousePlaneProjection(
						e,
						this.engine.viewController.getOppositeBasePlane(),
						picked.position
					);
				}
			}
		},
		mouseUp() {
			const picked = this.temp();
			if (picked) {
				this.temp().toggleSelect();
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
