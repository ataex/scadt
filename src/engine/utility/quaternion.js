'use strict';

export default function Quaternion() {
	return Object.freeze({
		init,
		initFromValues,
		initFromVector,
		initFromAxisAngle,
		multiply,
	});

	function init() {
		var out = new Float32Array(4);
		out[0] = 0;
		out[1] = 0;
		out[2] = 0;
		out[3] = 1;
		return out;
	}

	function initFromValues(x, y, z, w) {
		var out = new Float32Array(4);
		out[0] = x;
		out[1] = y;
		out[2] = z;
		out[3] = w;
		return out;
	}

	function initFromVector(a) {
		var out = new Float32Array(4);
		out[0] = a[0];
		out[1] = a[1];
		out[2] = a[2];
		out[3] = 1;
		return out;
	}

	function initFromAxisAngle(axis, rad) {
		var out = new Float32Array(4);
		rad = rad * 0.5;
		var s = Math.sin(rad);
		out[0] = s * axis[0];
		out[1] = s * axis[1];
		out[2] = s * axis[2];
		out[3] = Math.cos(rad);
		return out;
	}

	function multiply(out, a, b) {
		let ax = a[0],
			ay = a[1],
			az = a[2],
			aw = a[3],
			bx = b[0],
			by = b[1],
			bz = b[2],
			bw = b[3];

		out[0] = ax * bw + aw * bx + ay * bz - az * by;
		out[1] = ay * bw + aw * by + az * bx - ax * bz;
		out[2] = az * bw + aw * bz + ax * by - ay * bx;
		out[3] = aw * bw - ax * bx - ay * by - az * bz;
		return out;
	}
}
