import gm from '../engine/utility/graphics-math.js';

export default function Entity(
	model,
	position = [0, 0, 0],
	color = [0, 95, 135]
) {
	const p = gm.m4.init();

	p[12] = position[0];
	p[13] = position[1];
	p[14] = position[2];

	let selected = false;

	function isSelected() {
		return selected;
	}

	function toggleSelect() {
		selected = !selected;
	}

	return Object.freeze({
		model,
		color,
		position: p,

		isSelected,
		toggleSelect,

		move(position) {
			this.position[12] = position[0];
			this.position[13] = position[1];
			this.position[14] = position[2];
		},
		orient() {
			return gm.v3.init(
				this.position[12],
				this.position[13],
				this.position[14]
			);
		},

		rotate(axis, angle) {
			const r = gm.m3.fromMat4(this.position);
			gm.m3.invert(r, r);

			gm.v3.transformMat3(axis, axis, r);

			const q = gm.q.initFromAxisAngle(axis, angle);
			const v = gm.v3.init();

			const rot = gm.m4.fromRotationTranslation(gm.m4.init(), q, v);

			gm.m4.multiply(this.position, this.position, rot);

			//gm.m4.rotate(this.position, this.position, angle, axis);
		},
		scale(vector) {
			gm.m4.scale(this.position, this.position, vector);
		},
	});
}
