/*
Copyright (c) 2015-2018, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
'use strict';

const EPSILON = 0.000001;

export default {
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
};

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

/* Vector 3 factory function */
function Vector3() {
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
}

function Matrix3x3() {
	return Object.freeze({
		init,
		initFromValues,
		invert,
		fromQuat,
		fromMat4,
	});

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
}

function Matrix4x4() {
	return Object.freeze({
		init,
		clone,
		identity,
		invert,
		multiply,
		rotate,
		translate,
		transpose,
		fromRotationTranslation,
	});
	/**
	 * Creates a matrix from a quaternion rotation and vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     let quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @returns {mat4} out
	 */
	function fromRotationTranslation(out, q, v) {
		// Quaternion math
		let x = q[0],
			y = q[1],
			z = q[2],
			w = q[3];
		let x2 = x + x;
		let y2 = y + y;
		let z2 = z + z;

		let xx = x * x2;
		let xy = x * y2;
		let xz = x * z2;
		let yy = y * y2;
		let yz = y * z2;
		let zz = z * z2;
		let wx = w * x2;
		let wy = w * y2;
		let wz = w * z2;

		out[0] = 1 - (yy + zz);
		out[1] = xy + wz;
		out[2] = xz - wy;
		out[3] = 0;
		out[4] = xy - wz;
		out[5] = 1 - (xx + zz);
		out[6] = yz + wx;
		out[7] = 0;
		out[8] = xz + wy;
		out[9] = yz - wx;
		out[10] = 1 - (xx + yy);
		out[11] = 0;
		out[12] = v[0];
		out[13] = v[1];
		out[14] = v[2];
		out[15] = 1;

		return out;
	}
	function init() {
		var out = new Float32Array(16);
		out[0] = 1;
		out[1] = 0;
		out[2] = 0;
		out[3] = 0;
		out[4] = 0;
		out[5] = 1;
		out[6] = 0;
		out[7] = 0;
		out[8] = 0;
		out[9] = 0;
		out[10] = 1;
		out[11] = 0;
		out[12] = 0;
		out[13] = 0;
		out[14] = 0;
		out[15] = 1;
		return out;
	}

	function clone(a) {
		return new Float32Array(a);
	}

	function identity(out) {
		out[0] = 1;
		out[1] = 0;
		out[2] = 0;
		out[3] = 0;
		out[4] = 0;
		out[5] = 1;
		out[6] = 0;
		out[7] = 0;
		out[8] = 0;
		out[9] = 0;
		out[10] = 1;
		out[11] = 0;
		out[12] = 0;
		out[13] = 0;
		out[14] = 0;
		out[15] = 1;
		return out;
	}

	function invert(out, a) {
		let a00 = a[0],
			a01 = a[1],
			a02 = a[2],
			a03 = a[3],
			a10 = a[4],
			a11 = a[5],
			a12 = a[6],
			a13 = a[7],
			a20 = a[8],
			a21 = a[9],
			a22 = a[10],
			a23 = a[11],
			a30 = a[12],
			a31 = a[13],
			a32 = a[14],
			a33 = a[15],
			b00 = a00 * a11 - a01 * a10,
			b01 = a00 * a12 - a02 * a10,
			b02 = a00 * a13 - a03 * a10,
			b03 = a01 * a12 - a02 * a11,
			b04 = a01 * a13 - a03 * a11,
			b05 = a02 * a13 - a03 * a12,
			b06 = a20 * a31 - a21 * a30,
			b07 = a20 * a32 - a22 * a30,
			b08 = a20 * a33 - a23 * a30,
			b09 = a21 * a32 - a22 * a31,
			b10 = a21 * a33 - a23 * a31,
			b11 = a22 * a33 - a23 * a32,
			// Calculate the determinant
			det =
				b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

		if (!det) {
			return null;
		}
		det = 1.0 / det;

		out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
		out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
		out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
		out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
		out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
		out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
		out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
		out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
		out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
		out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
		out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
		out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
		out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
		out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
		out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
		out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

		return out;
	}

	function multiply(out, a, b) {
		let a00 = a[0],
			a01 = a[1],
			a02 = a[2],
			a03 = a[3],
			a10 = a[4],
			a11 = a[5],
			a12 = a[6],
			a13 = a[7],
			a20 = a[8],
			a21 = a[9],
			a22 = a[10],
			a23 = a[11],
			a30 = a[12],
			a31 = a[13],
			a32 = a[14],
			a33 = a[15];

		var b0 = b[0],
			b1 = b[1],
			b2 = b[2],
			b3 = b[3];
		out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
		out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
		out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
		out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

		b0 = b[4];
		b1 = b[5];
		b2 = b[6];
		b3 = b[7];
		out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
		out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
		out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
		out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

		b0 = b[8];
		b1 = b[9];
		b2 = b[10];
		b3 = b[11];
		out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
		out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
		out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
		out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

		b0 = b[12];
		b1 = b[13];
		b2 = b[14];
		b3 = b[15];
		out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
		out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
		out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
		out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
		return out;
	}

	/**
	 * Rotates a mat4 by the given angle around the given axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @param {vec3} axis the axis to rotate around
	 * @returns {mat4} out
	 */
	function rotate(out, a, rad, axis) {
		let x = axis[0],
			y = axis[1],
			z = axis[2];
		let len = Math.sqrt(x * x + y * y + z * z);
		let s, c, t;
		let a00, a01, a02, a03;
		let a10, a11, a12, a13;
		let a20, a21, a22, a23;
		let b00, b01, b02;
		let b10, b11, b12;
		let b20, b21, b22;

		if (len < EPSILON) {
			return null;
		}

		len = 1 / len;
		x *= len;
		y *= len;
		z *= len;

		s = Math.sin(rad);
		c = Math.cos(rad);
		t = 1 - c;

		a00 = a[0];
		a01 = a[1];
		a02 = a[2];
		a03 = a[3];
		a10 = a[4];
		a11 = a[5];
		a12 = a[6];
		a13 = a[7];
		a20 = a[8];
		a21 = a[9];
		a22 = a[10];
		a23 = a[11];

		// Construct the elements of the rotation matrix
		b00 = x * x * t + c;
		b01 = y * x * t + z * s;
		b02 = z * x * t - y * s;
		b10 = x * y * t - z * s;
		b11 = y * y * t + c;
		b12 = z * y * t + x * s;
		b20 = x * z * t + y * s;
		b21 = y * z * t - x * s;
		b22 = z * z * t + c;

		// Perform rotation-specific matrix multiplication
		out[0] = a00 * b00 + a10 * b01 + a20 * b02;
		out[1] = a01 * b00 + a11 * b01 + a21 * b02;
		out[2] = a02 * b00 + a12 * b01 + a22 * b02;
		out[3] = a03 * b00 + a13 * b01 + a23 * b02;
		out[4] = a00 * b10 + a10 * b11 + a20 * b12;
		out[5] = a01 * b10 + a11 * b11 + a21 * b12;
		out[6] = a02 * b10 + a12 * b11 + a22 * b12;
		out[7] = a03 * b10 + a13 * b11 + a23 * b12;
		out[8] = a00 * b20 + a10 * b21 + a20 * b22;
		out[9] = a01 * b20 + a11 * b21 + a21 * b22;
		out[10] = a02 * b20 + a12 * b21 + a22 * b22;
		out[11] = a03 * b20 + a13 * b21 + a23 * b22;

		if (a !== out) {
			// If the source and destination differ, copy the unchanged last row
			out[12] = a[12];
			out[13] = a[13];
			out[14] = a[14];
			out[15] = a[15];
		}
		return out;
	}
	function translate(out, a, v) {
		var x = v[0],
			y = v[1],
			z = v[2],
			a00,
			a01,
			a02,
			a03,
			a10,
			a11,
			a12,
			a13,
			a20,
			a21,
			a22,
			a23;

		if (a === out) {
			out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
			out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
			out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
			out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
		} else {
			a00 = a[0];
			a01 = a[1];
			a02 = a[2];
			a03 = a[3];
			a10 = a[4];
			a11 = a[5];
			a12 = a[6];
			a13 = a[7];
			a20 = a[8];
			a21 = a[9];
			a22 = a[10];
			a23 = a[11];

			out[0] = a00;
			out[1] = a01;
			out[2] = a02;
			out[3] = a03;
			out[4] = a10;
			out[5] = a11;
			out[6] = a12;
			out[7] = a13;
			out[8] = a20;
			out[9] = a21;
			out[10] = a22;
			out[11] = a23;

			out[12] = a00 * x + a10 * y + a20 * z + a[12];
			out[13] = a01 * x + a11 * y + a21 * z + a[13];
			out[14] = a02 * x + a12 * y + a22 * z + a[14];
			out[15] = a03 * x + a13 * y + a23 * z + a[15];
		}
		return out;
	}

	function transpose(out, a) {
		// If we are transposing ourselves we can skip a few steps but have to cache some values
		if (out === a) {
			let a01 = a[1],
				a02 = a[2],
				a03 = a[3],
				a12 = a[6],
				a13 = a[7],
				a23 = a[11];

			out[1] = a[4];
			out[2] = a[8];
			out[3] = a[12];
			out[4] = a01;
			out[6] = a[9];
			out[7] = a[13];
			out[8] = a02;
			out[9] = a12;
			out[11] = a[14];
			out[12] = a03;
			out[13] = a13;
			out[14] = a23;
		} else {
			out[0] = a[0];
			out[1] = a[4];
			out[2] = a[8];
			out[3] = a[12];
			out[4] = a[1];
			out[5] = a[5];
			out[6] = a[9];
			out[7] = a[13];
			out[8] = a[2];
			out[9] = a[6];
			out[10] = a[10];
			out[11] = a[14];
			out[12] = a[3];
			out[13] = a[7];
			out[14] = a[11];
			out[15] = a[15];
		}
		return out;
	}
}

function Quaternion() {
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

function Vector4() {
	return Object.freeze({
		fromValues,
		transformMat4,
	});

	/**
	 * Creates a new vec4 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {vec4} a new 4D vector
	 */
	function fromValues(x, y, z, w) {
		let out = new Float32Array(4);
		out[0] = x;
		out[1] = y;
		out[2] = z;
		out[3] = w;
		return out;
	}

	/**
	 * Transforms the vec4 with a mat4.
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec4} out
	 */
	function transformMat4(out, a, m) {
		let x = a[0],
			y = a[1],
			z = a[2],
			w = a[3];
		out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
		out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
		out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
		out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
		return out;
	}
}
