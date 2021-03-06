'use strict';

import gm from './utility/graphics-math.js';
import initProgramManager from './program-manager.js';
import initViewController from './view-controller.js';

import parseObj from './obj-parser.js';

export default function Engine() {
	const self = {};
	const viewport = initViewport(self);
	const gl = initGl(viewport);

	const programManager = initProgramManager(gl);
	const viewController = initViewController(gl);

	return Object.freeze(
		Object.assign(self, {
			viewport,
			gl,
			programManager,
			viewController,
			pick,
			draw,
			loadStatic,
			createModel,
			updateViewportSize,
			parseObj,
		})
	);
}

function initViewport(self) {
	const viewport = document.createElement('CANVAS');
	viewport.className = 'viewport';

	window.addEventListener('resize', updateViewportSize.bind(self));
	return viewport;
}

function initGl(viewport) {
	const gl = viewport.getContext('webgl2');
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	gl.clear(gl.COLOR_BUFFER_BIT);
	return gl;
}

function updateViewportSize() {
	this.viewport.width = this.viewport.clientWidth;
	this.viewport.height = this.viewport.clientHeight;
	// prettier-ignore
	this.gl.viewport(0, 0,
		this.gl.drawingBufferWidth,
		this.gl.drawingBufferHeight
	);
}

function loadStatic(url) {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.addEventListener('load', function() {
			if (this.status >= 200 && this.status < 300) {
				resolve(this.response);
			} else {
				reject({
					status: this.status,
					statusText: this.statusText,
				});
			}
		});
		xhr.addEventListener('error', function() {
			reject({
				status: this.status,
				statusText: this.statusText,
			});
		});
		xhr.send();
	});
}

function createModel({ vertices, indices, layout, mode }) {
	const gl = this.gl;
	const vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(
		gl.ELEMENT_ARRAY_BUFFER,
		new Uint16Array(indices),
		gl.STATIC_DRAW
	);

	layout = layout.split('').reduce(
		(result, attr) => {
			if (!result.hasOwnProperty(attr)) result[attr] = result.stride;
			result.stride += 4;
			return result;
		},
		{ stride: 0 }
	);

	return {
		vertexBuffer,
		indexBuffer,
		indexCount: indices.length,
		layout,
		mode,
	};
}

function draw({
	model: { vertexBuffer, indexBuffer, indexCount, layout, mode },
	program = 'pn',
	position = [0, 0, 0],
	color = [0, 95, 135],
}) {
	const gl = this.gl;
	// Set shader program
	program = this.programManager[program];
	gl.useProgram(program);

	// Set projection-view matrix
	if (program.hasOwnProperty('uPVMatrix')) {
		gl.uniformMatrix4fv(
			program.uPVMatrix,
			false,
			this.viewController.getPVMatrix()
		);
	}

	const modelMatrix = position;

	if (program.hasOwnProperty('uMMatrix')) {
		gl.uniformMatrix4fv(program.uMMatrix, false, modelMatrix);
	}

	// Set object color
	if (program.hasOwnProperty('uObjectColor')) {
		gl.uniform3fv(program.uObjectColor, color);
	}

	// Set normal matrix
	const normalMatrix = gm.m4.init();
	gm.m4.invert(normalMatrix, modelMatrix);
	gm.m4.transpose(normalMatrix, normalMatrix);
	if (program.hasOwnProperty('uNMatrix')) {
		gl.uniformMatrix4fv(program.uNMatrix, false, normalMatrix);
	}

	// Set mode buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	if (program.hasOwnProperty('aVertexPosition')) {
		gl.enableVertexAttribArray(program.aVertexPosition);
		gl.vertexAttribPointer(
			program.aVertexPosition,
			3,
			gl.FLOAT,
			false,
			layout.stride,
			layout.p
		);
	}

	if (program.hasOwnProperty('aVertexColor')) {
		gl.enableVertexAttribArray(program.aVertexColor);
		gl.vertexAttribPointer(
			program.aVertexColor,
			3,
			gl.FLOAT,
			false,
			layout.stride,
			layout.c
		);
	}

	if (program.hasOwnProperty('aVertexNormal')) {
		gl.enableVertexAttribArray(program.aVertexNormal);
		gl.vertexAttribPointer(
			program.aVertexNormal,
			3,
			gl.FLOAT,
			false,
			layout.stride,
			layout.n
		);
	}
	/*
		if (program.hasOwnProperty('aTextureCoord')) {
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.uniform1i(program.uSampler, 0);
			gl.enableVertexAttribArray(program.aTextureCoord);
			gl.vertexAttribPointer(
				program.aTextureCoord,
				2,
				gl.FLOAT,
				false,
				layout.stride,
				layout.t
			);
		}
		*/
	// Set index buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

	// Draw
	gl.drawElements(gl[mode], indexCount, gl.UNSIGNED_SHORT, 0);
}

function pick(list, e) {
	let x = e.pageX - this.viewport.offsetLeft;
	let y = this.viewport.height - e.pageY - this.viewport.offsetTop;

	const gl = this.gl;
	const width = this.viewport.width;
	const height = this.viewport.height;

	const frameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	gl.viewport(0, 0, width, height);

	var colorBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, colorBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA8, width, height);
	gl.framebufferRenderbuffer(
		gl.FRAMEBUFFER,
		gl.COLOR_ATTACHMENT0,
		gl.RENDERBUFFER,
		colorBuffer
	);

	const depthBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
	gl.framebufferRenderbuffer(
		gl.FRAMEBUFFER,
		gl.DEPTH_ATTACHMENT,
		gl.RENDERBUFFER,
		depthBuffer
	);

	list.forEach((v, i) => {
		this.draw({
			model: v.model,
			position: v.position,
			color: [i + 1, 0, 0],
			program: 'p',
		});
	});

	let color = new Uint8Array(1 * 1 * 4);
	gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, color);

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.viewport(0, 0, width, height);

	return list[color[0] - 1];
}
