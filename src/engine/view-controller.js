'use strict';
import gm from './utility/graphics-math.js';

export default function initViewController(gl) {
	const target = gm.v3.init(0, 0, 0);
	const position = gm.v3.init(8, 8, 8);
	const up = gm.v3.init(0, 1, 0);

	const projection = 0;

	const rotateSens = 1;
	const moveSens = 0.01;
	const zoomSens = 0.75;
	// prettier-ignore
	return Object.freeze({
		gl,projection,
		target, position, up,
		rotateSens, moveSens, zoomSens,
		
		setProjection, getPVMatrix,
		rotate, move,zoom,
		project,
		unProject,
		getOppositeBasePlane
	});
}

function setProjection(p) {
	this.projection = p;
}

function getPVMatrix() {
	const gl = this.gl;
	let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;

	let viewMat = gm.lookAt(this.position, this.target, this.up);
	let projMat;

	if (this.projection == 1) {
		projMat = gm.perspective(gm.m4.init(), 45, aspect, 0.1, 100.0);
	} else {
		let res = gm.v3.subtract(gm.v3.init(), this.position, this.target);
		let z = gm.v3.length(res) / 3;
		projMat = gm.ortho(
			gm.m4.init(),
			-z * aspect,
			z * aspect,
			-z,
			z,
			-100,
			100.0
		);
	}

	return gm.m4.multiply(projMat, projMat, viewMat);
}

function zoom(a) {
	var res = gm.v3.init();

	gm.v3.subtract(res, this.position, this.target);
	gm.v3.normalize(res, res);
	gm.v3.scale(res, res, this.zoomSens);

	if (a > 0) gm.v3.subtract(this.position, this.position, res);
	else gm.v3.add(this.position, this.position, res);
	//vec3.add(res, this.target, this.position);
}

/**
 * Move camera in xz plane by a given vector.
 * @param (Vector2) - Vector for moving.
 */
function move(v) {
	var dir = gm.v3.init();

	gm.v3.subtract(dir, this.target, this.position);

	var a = -Math.atan(dir[0] / dir[2]);
	a = dir[2] > 0 ? a + Math.PI : dir[2] < 0 && dir[0] > 0 ? a + 2 * Math.PI : a;

	var offset = gm.v3.init(
		v[0] * Math.cos(a) - v[1] * Math.sin(a),
		0,
		v[0] * Math.sin(a) + v[1] * Math.cos(a)
	);

	gm.v3.scale(offset, offset, this.moveSens);

	gm.v3.add(this.target, this.target, offset);
	gm.v3.add(this.position, this.position, offset);
}

function getOppositeBasePlane() {
	const v = gm.v3.subtract(gm.v3.init(), this.target, this.position);
	return gm.v3.init(
		+(Math.abs(v[0] / v[1]) > 1 && Math.abs(v[0] / v[2]) > 1),
		+(Math.abs(v[1] / v[0]) >= 1 && Math.abs(v[1] / v[2]) >= 1),
		+(Math.abs(v[2] / v[0]) > 1 && Math.abs(v[2] / v[1]) > 1)
	);
}

function rotate(xr, yr) {
	xr = (xr / 180) * 3.14 * this.rotateSens;
	yr = (-yr / 180) * 3.14 * this.rotateSens;

	var dir = gm.v3.init();
	gm.v3.subtract(dir, this.position, this.target);

	var side = gm.v3.init();
	gm.v3.cross(side, dir, this.up);
	gm.v3.normalize(side, side);

	var heading = gm.q.initFromAxisAngle(gm.v3.init(0, 1, 0), xr);
	var pitch = gm.q.initFromAxisAngle(side, yr);
	var view = gm.q.initFromVector(dir);

	var result = gm.q.init();
	gm.q.multiply(result, heading, pitch);
	gm.q.multiply(result, result, view);

	gm.v3.add(this.position, result, this.target);
}

/**
 * Convert screen coordinate to WebGL Coordinates.
 * @param {number} x - X screen coordinate.
 * @param {number} y - Y screen coordinate.
 * @param {number} z - Z range.
 * @param {Matrix4} pvMat - Projection view matrix.
 * @param {number} width - Canvas width.
 * @param {number} height - Canvas height.
 * @return {Vector3} - Coordinates of webgl.
 */
function unProject(x, y, z) {
	const pvMat = this.getPVMatrix();

	const width = this.gl.drawingBufferWidth;
	const height = this.gl.drawingBufferHeight;

	x = (x / width) * 2 - 1;
	y = (y / height) * -2 + 1;
	z = 2 * z - 1;

	let invMat = gm.m4.invert(gm.m4.init(), pvMat);

	let point = gm.v3.init(x, y, z);
	gm.v3.transform(point, point, invMat);
	return point;
}

function project(position) {
	const pvMat = this.getPVMatrix();

	let point = gm.v4.fromValues(position[0], position[1], position[2], 1);
	gm.v4.transformMat4(point, point, pvMat);
	point[0] /= point[3];
	point[1] /= point[3];
	point[2] /= point[3];

	const width = this.gl.drawingBufferWidth;
	const height = this.gl.drawingBufferHeight;

	return [((point[0] + 1) * width) / 2, ((point[1] - 1) * height) / -2];

	return point;
}
