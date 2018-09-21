'use strict';

export default function Vector3() {
	return Object.freeze({
		add,
		cross,
		dot,
		init,
		initFromVector,
		length,
		normalize,
		scale,
		subtract,
		transform,
		transformMat3,
	});
}

function add(out, a, b) {
	for (var i = 0; i < b.length; i++) {
		out[i] = a[i] + b[i];
	}
	return out;
}

function cross(out, a, b) {
	let ax = a[0],
		ay = a[1],
		az = a[2],
		bx = b[0],
		by = b[1],
		bz = b[2];

	out[0] = ay * bz - az * by;
	out[1] = az * bx - ax * bz;
	out[2] = ax * by - ay * bx;
	return out;
}

function dot(a, b) {
	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function init(x = 0, y = 0, z = 0) {
	var out = new Float32Array(3);
	out[0] = x;
	out[1] = y;
	out[2] = z;

	return out;
}

function initFromVector(a) {
	var out = new Float32Array(3);
	out[0] = a[0];
	out[1] = a[1];
	out[2] = a[2];
	return out;
}

function length(a) {
	var x = a[0],
		y = a[1],
		z = a[2];
	return Math.sqrt(x * x + y * y + z * z);
}

function normalize(out, a) {
	let x = a[0],
		y = a[1],
		z = a[2];
	let len = x * x + y * y + z * z;
	if (len > 0) {
		len = 1 / Math.sqrt(len);
		out[0] = a[0] * len;
		out[1] = a[1] * len;
		out[2] = a[2] * len;
	}
	return out;
}

function scale(out, a, b) {
	out[0] = a[0] * b;
	out[1] = a[1] * b;
	out[2] = a[2] * b;
	return out;
}

function subtract(out, a, b) {
	out[0] = a[0] - b[0];
	out[1] = a[1] - b[1];
	out[2] = a[2] - b[2];
	return out;
}

function transform(out, a, m) {
	let x = a[0],
		y = a[1],
		z = a[2],
		w = m[3] * x + m[7] * y + m[11] * z + m[15];
	w = w || 1.0;
	out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
	out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
	out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
	return out;
}

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
function transformMat3(out, a, m) {
	let x = a[0],
		y = a[1],
		z = a[2];
	out[0] = x * m[0] + y * m[3] + z * m[6];
	out[1] = x * m[1] + y * m[4] + z * m[7];
	out[2] = x * m[2] + y * m[5] + z * m[8];
	return out;
}
