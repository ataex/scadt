'use strict';

export default function Matrix3x3() {
	return Object.freeze({
		init,
		initFromValues,
		invert,
		fromQuat,
		fromMat4,
	});
}

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function invert(out, a) {
	let a00 = a[0],
		a01 = a[1],
		a02 = a[2];
	let a10 = a[3],
		a11 = a[4],
		a12 = a[5];
	let a20 = a[6],
		a21 = a[7],
		a22 = a[8];

	let b01 = a22 * a11 - a12 * a21;
	let b11 = -a22 * a10 + a12 * a20;
	let b21 = a21 * a10 - a11 * a20;

	// Calculate the determinant
	let det = a00 * b01 + a01 * b11 + a02 * b21;

	if (!det) {
		return null;
	}
	det = 1.0 / det;

	out[0] = b01 * det;
	out[1] = (-a22 * a01 + a02 * a21) * det;
	out[2] = (a12 * a01 - a02 * a11) * det;
	out[3] = b11 * det;
	out[4] = (a22 * a00 - a02 * a20) * det;
	out[5] = (-a12 * a00 + a02 * a10) * det;
	out[6] = b21 * det;
	out[7] = (-a21 * a00 + a01 * a20) * det;
	out[8] = (a11 * a00 - a01 * a10) * det;
	return out;
}

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
function init() {
	let out = new Float32Array(9);
	out[1] = 0;
	out[2] = 0;
	out[3] = 0;
	out[5] = 0;
	out[6] = 0;
	out[7] = 0;
	out[0] = 1;
	out[4] = 1;
	out[8] = 1;
	return out;
}

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
function fromMat4(a) {
	let out = new Float32Array(9);
	out[0] = a[0];
	out[1] = a[1];
	out[2] = a[2];
	out[3] = a[4];
	out[4] = a[5];
	out[5] = a[6];
	out[6] = a[8];
	out[7] = a[9];
	out[8] = a[10];
	return out;
}

function initFromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
	var out = new Float32Array(9);
	out[0] = m00;
	out[1] = m01;
	out[2] = m02;
	out[3] = m10;
	out[4] = m11;
	out[5] = m12;
	out[6] = m20;
	out[7] = m21;
	out[8] = m22;
	return out;
}
/**
 * Calculates a 3x3 matrix from the given quaternion
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat3} out
 */
function fromQuat(out, q) {
	let x = q[0],
		y = q[1],
		z = q[2],
		w = q[3];
	let x2 = x + x;
	let y2 = y + y;
	let z2 = z + z;

	let xx = x * x2;
	let yx = y * x2;
	let yy = y * y2;
	let zx = z * x2;
	let zy = z * y2;
	let zz = z * z2;
	let wx = w * x2;
	let wy = w * y2;
	let wz = w * z2;

	out[0] = 1 - yy - zz;
	out[3] = yx - wz;
	out[6] = zx + wy;

	out[1] = yx + wz;
	out[4] = 1 - xx - zz;
	out[7] = zy - wx;

	out[2] = zx - wy;
	out[5] = zy + wx;
	out[8] = 1 - xx - yy;

	return out;
}
