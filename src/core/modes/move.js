'use strict';

import gm from '../../engine/utility/graphics-math.js';
import Mode from './mode.js';

export default function Move() {
	let foo = gm.v3.init();

	return Object.assign({}, Mode(), {
		mouseDown(e) {
			if (e.buttons === 1) {
				const picked = this.engine.pick(this.scene, e);
				if (picked) {
					picked.toggleSelect();
					this.temp(picked);

					const r = this.mousePlaneProjection(
						e,
						this.engine.viewController.getOppositeBasePlane(),
						picked.position
					);
					gm.v3.subtract(foo, r, picked.orient());
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
