import { m4 } from './gmath/gmath.js';
import GeometryMaker from './geometry-maker.js';
import ViewController from './view-controller.js';
import ProgramManager from './program-manager.js';
import ResourceManager from './resource-manager.js';

export default class Engine {
	constructor() {
		this.viewport = this.initViewport();
		this.gl = this.initGl(this.viewport);

		this.geometryMaker = new GeometryMaker();
		this.programManager = new ProgramManager(this.gl);
		this.viewController = new ViewController(this.gl);
		this.resourceManager = new ResourceManager();
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

	createModel({ vertices, indices, pack, mode }) {
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

		const stride = pack.split('').reduce(
			(r, v) => {
				if (!r.hasOwnProperty(v)) r[v] = r.s;
				r.s += 4;
				return r;
			},
			{ s: 0 }
		);

		return {
			vertexBuffer: vertexBuffer,
			indexBuffer: indexBuffer,
			indexCount: indices.length,
			stride: stride,
			mode: mode,
		};
	}

	draw(
		{ vertexBuffer, indexBuffer, indexCount, stride, mode },
		programName,
		position = [0, 0, 0],
		color = [200, 200, 200]
	) {
		const gl = this.gl;
		// Set shader program
		const program = this.programManager[programName];
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
				stride.s,
				stride.p
			);
		}

		if (program.hasOwnProperty('aVertexColor')) {
			gl.enableVertexAttribArray(program.aVertexColor);
			gl.vertexAttribPointer(
				program.aVertexColor,
				3,
				gl.FLOAT,
				false,
				stride.s,
				stride.c
			);
		}

		if (program.hasOwnProperty('aVertexNormal')) {
			gl.enableVertexAttribArray(program.aVertexNormal);
			gl.vertexAttribPointer(
				program.aVertexNormal,
				3,
				gl.FLOAT,
				false,
				stride.s,
				stride.n
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
				model.stride.s,
				model.stride.t
			);
		}
		*/
		// Set index buffer
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

		// Draw
		gl.drawElements(gl[mode], indexCount, gl.UNSIGNED_SHORT, 0);
	}
}
