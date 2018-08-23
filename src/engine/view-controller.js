import { gm, v3, q, m4 } from './gmath/gmath.js';

export default class ViewController {
	constructor(gl) {
		this.gl = gl;
		this.target = v3.init(0, 0, 0);
		this.position = v3.init(8, 8, 8);
		this.up = v3.init(0, 1, 0);

		this.projection = 0;

		this.rotateSens = 1;
		this.moveSens = 0.01;
		this.zoomSens = 0.75;
	}

	setProjection(p) {
		this.projection = p;
	}

	getPVMatrix() {
		const gl = this.gl;
		let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;

		let viewMat = gm.lookAt(this.position, this.target, this.up);
		let projMat;

		if (this.projection == 1) {
			projMat = gm.perspective(m4.init(), 45, aspect, 0.1, 100.0);
		} else {
			let res = v3.subtract(v3.init(), this.position, this.target);
			let z = v3.length(res) / 3;
			projMat = gm.ortho(
				m4.init(),
				-z * aspect,
				z * aspect,
				-z,
				z,
				-100,
				100.0
			);
		}

		return m4.multiply(projMat, projMat, viewMat);
	}

	zoom(a) {
		var res = v3.init();

		v3.subtract(res, this.position, this.target);
		v3.normalize(res, res);
		v3.scale(res, res, this.zoomSens);

		if (a > 0) v3.subtract(this.position, this.position, res);
		else v3.add(this.position, this.position, res);
		//vec3.add(res, this.target, this.position);
	}

	/**
	 * Move camera in xz plane by a given vector.
	 * @param (Vector2) - Vector for moving.
	 */
	move(v) {
		var dir = v3.init();

		v3.subtract(dir, this.target, this.position);

		var a = -Math.atan(dir[0] / dir[2]);
		a =
			dir[2] > 0 ? a + Math.PI : dir[2] < 0 && dir[0] > 0 ? a + 2 * Math.PI : a;

		var offset = v3.init(
			v[0] * Math.cos(a) - v[1] * Math.sin(a),
			0,
			v[0] * Math.sin(a) + v[1] * Math.cos(a)
		);

		v3.scale(offset, offset, this.moveSens);

		v3.add(this.target, this.target, offset);
		v3.add(this.position, this.position, offset);
	}

	rotate(xr, yr) {
		xr = (xr / 180) * 3.14 * this.rotateSens;
		yr = (-yr / 180) * 3.14 * this.rotateSens;

		var dir = v3.init();
		v3.subtract(dir, this.position, this.target);

		var side = v3.init();
		v3.cross(side, dir, this.up);
		v3.normalize(side, side);

		var heading = q.initFromAxisAngle(v3.init(0, 1, 0), xr);
		var pitch = q.initFromAxisAngle(side, yr);
		var view = q.initFromVector(dir);

		var result = q.init();
		q.multiply(result, heading, pitch);
		q.multiply(result, result, view);

		v3.add(this.position, result, this.target);
	}
}
