import { m4 } from './gmath/gmath.js';
import GeometryMaker from './geometry-maker.js';
import ObjParser from './obj-parser.js';
import ProgramManager from './program-manager.js';
import ViewController from './view-controller.js';

export default class Engine {
	constructor() {
		this.viewport = this.initViewport();
		this.gl = this.initGl(this.viewport);

		this.geometryMaker = new GeometryMaker();
		this.programManager = new ProgramManager(this.gl);
		this.viewController = new ViewController(this.gl);
		this.objParser = new ObjParser();
	}

	updateViewportSize() {
		this.viewport.width = this.viewport.clientWidth;
		this.viewport.height = this.viewport.clientHeight;
		// prettier-ignore
		this.gl.viewport(0, 0,
			this.gl.drawingBufferWidth,
			this.gl.drawingBufferHeight
		);
	}

	initViewport() {
		const viewport = document.createElement('CANVAS');
		viewport.className = 'viewport';
		window.addEventListener('resize', this.updateViewportSize.bind(this));
		return viewport;
	}

	initGl(viewport) {
		const gl = viewport.getContext('webgl2');
		//gl.clearColor(1.0, 1.0, 1.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		gl.clear(gl.COLOR_BUFFER_BIT);
		return gl;
	}

	loadStatic(url) {
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

	createModel({ vertices, indices, layout, mode }) {
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

	draw(
		{ vertexBuffer, indexBuffer, indexCount, layout, mode },
		{ program = 'pn', position = [0, 0, 0], color = [200, 200, 200] }
	) {
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

		// Set model matrix
		const modelMatrix = m4.init();
		if (position) m4.translate(modelMatrix, modelMatrix, position);

		if (program.hasOwnProperty('uMMatrix')) {
			gl.uniformMatrix4fv(program.uMMatrix, false, modelMatrix);
		}

		// Set object color
		if (program.hasOwnProperty('uObjectColor')) {
			gl.uniform3fv(program.uObjectColor, color);
		}

		// Set normal matrix
		const normalMatrix = m4.init();
		m4.invert(normalMatrix, modelMatrix);
		m4.transpose(normalMatrix, normalMatrix);
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
}
