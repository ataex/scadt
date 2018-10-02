'use strict';

import gm from '../../engine/utility/graphics-math.js';
import Mode from './mode.js';

export default function Scale() {
	let origin;
	let len;

	return Object.assign({}, Mode(), {
		mouseDown(e) {
			if (e.buttons === 1) {
				const picked = this.engine.pick(this.scene, e);
				if (picked) {
					origin = this.engine.viewController.project(picked.orient());
					const dir = [e.clientX - origin[0], e.clientY - origin[1]];
					len = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1]);
					picked.toggleSelect();
					this.temp(picked);
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

				const newLen = Math.sqrt(nir[0] * nir[0] + nir[1] * nir[1]);
				let sc = newLen - len;
				sc = 1 + Math.sign(sc) * 0.1;
				const plane = [sc, sc, sc];
				picked.scale(plane);
				len = newLen;
			}
		},
	});
}
