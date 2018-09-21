/* Copyright (c) 2015-2018, Brandon Jones, Colin MacKenzie IV. */

'use strict';

import Vector3 from './vector-3.js';
import Vector4 from './vector-4.js';
import Matrix3x3 from './matrix-3x3.js';
import Matrix4x4 from './matrix-4x4.js';
import Quaternion from './quaternion.js';

export const EPSILON = 0.000001;

export default Object.freeze({
	v3: Vector3(),
	v4: Vector4(),
	m3: Matrix3x3(),
	m4: Matrix4x4(),
	q: Quaternion(),
	linePlaneIntersec,
	toRadian,
	equals,
	lookAt,
	perspective,
	ortho,
});

function toRadian(a) {
	return a * (Math.PI / 180);
}

function equals(a, b) {
	return (
		Math.abs(a - b) <= GLMATHEPSILON * Math.max(1.0, Math.abs(a), Math.abs(b))
	);
}

function lookAt(eye, center, up) {
	let x0,
		x1,
		x2,
		y0,
		y1,
		y2,
		z0,
		z1,
		z2,
		len,
		eyex = eye[0],
		eyey = eye[1],
		eyez = eye[2],
		upx = up[0],
		upy = up[1],
		upz = up[2],
		centerx = center[0],
		centery = center[1],
		centerz = center[2];

	z0 = eyex - centerx;
	z1 = eyey - centery;
	z2 = eyez - centerz;

	len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
	z0 *= len;
	z1 *= len;
	z2 *= len;

	x0 = upy * z2 - upz * z1;
	x1 = upz * z0 - upx * z2;
	x2 = upx * z1 - upy * z0;
	len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
	if (!len) {
		x0 = 0;
		x1 = 0;
		x2 = 0;
	} else {
		len = 1 / len;
		x0 *= len;
		x1 *= len;
		x2 *= len;
	}

	y0 = z1 * x2 - z2 * x1;
	y1 = z2 * x0 - z0 * x2;
	y2 = z0 * x1 - z1 * x0;

	len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
	if (!len) {
		y0 = 0;
		y1 = 0;
		y2 = 0;
	} else {
		len = 1 / len;
		y0 *= len;
		y1 *= len;
		y2 *= len;
	}
	var r = new Float32Array(16);
	r[0] = x0;
	r[1] = y0;
	r[2] = z0;
	r[3] = 0;
	r[4] = x1;
	r[5] = y1;
	r[6] = z1;
	r[7] = 0;
	r[8] = x2;
	r[9] = y2;
	r[10] = z2;
	r[11] = 0;
	r[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
	r[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
	r[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
	r[15] = 1;

	return r;
}

/**
 * Generates a perspective projection matrix with the given bounds.
 * @param {Matrix4} - Frustum matrix will be written into.
 * @param {number} - Vertical field of view in radians.
 * @param {number} - Aspect ratio. typically viewport width/height.
 * @param {number} - Near bound of the frustum.
 * @param {number} - Far bound of the frustum.
 * @returns {Matrix4}
 */
function perspective(out, fovy, aspect, near, far) {
	var f = 1.0 / Math.tan(fovy / 2),
		nf = 1 / (near - far);
	out[0] = f / aspect;
	out[1] = 0;
	out[2] = 0;
	out[3] = 0;
	out[4] = 0;
	out[5] = f;
	out[6] = 0;
	out[7] = 0;
	out[8] = 0;
	out[9] = 0;
	out[10] = (far + near) * nf;
	out[11] = -1;
	out[12] = 0;
	out[13] = 0;
	out[14] = 2 * far * near * nf;
	out[15] = 0;
	return out;
}

/**
 * Generates a orthogonal projection matrix with the given bounds.
 * @param {Matrix4} out - Frustum matrix will be written into.
 * @param {number} left - Left bound of the frustum.
 * @param {number} right - Right bound of the frustum.
 * @param {number} bottom - Bottom bound of the frustum.
 * @param {number} top - Top bound of the frustum.
 * @param {number} near - Near bound of the frustum.
 * @param {number} far - Far bound of the frustum.
 * @returns {Matrix4}
 */
function ortho(out, left, right, bottom, top, near, far) {
	let lr = 1 / (left - right),
		bt = 1 / (bottom - top),
		nf = 1 / (near - far);
	out[0] = -2 * lr;
	out[1] = 0;
	out[2] = 0;
	out[3] = 0;
	out[4] = 0;
	out[5] = -2 * bt;
	out[6] = 0;
	out[7] = 0;
	out[8] = 0;
	out[9] = 0;
	out[10] = 2 * nf;
	out[11] = 0;
	out[12] = (left + right) * lr;
	out[13] = (top + bottom) * bt;
	out[14] = (far + near) * nf;
	out[15] = 1;
	return out;
}

/**
 * Find intersection of a line and a plane.
 * @param {Vector3} l0 - Start point of line.
 * @param {Vector3} l1 - End point of line.
 * @param {Vector3} n - Normal to plane.
 * @param {Vector3} p - Point belonging to the plane.
 * @return {Vector3} - Point of intersection.
 */
function linePlaneIntersec(l0, l1, n, p) {
	p = this.v3.init(0, 0, 0);
	this.v3.subtract(l1, l1, l0);
	let pl1 = this.v3.dot(n, l1); //Projection lenght.

	if (Math.abs(pl1) > Number.EPSILON) {
		this.v3.subtract(p, p, l0);
		let pl2 = this.v3.dot(n, p);

		this.v3.scale(l1, l1, pl2 / pl1);

		return this.v3.add(l1, l1, l0);
	} else {
		return;
	}
}
