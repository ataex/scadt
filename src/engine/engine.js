import { m4 } from './gmath/gmath.js';
import ViewController from './view-controller.js';
import ResourceManager from './resource-manager.js';
import ProgramManager from './program-manager.js';

export default class Engine {
	constructor() {
		this.init();

		this.viewController = new ViewController(this.gl);
		this.resourceManager = new ResourceManager();
		this.programManager = new ProgramManager(this.gl);

		const grid = this.genGrid(10, 0.2);
		this.gridModel = this.createModel(grid.v, grid.i, 12, 'LINES', 'v');
		this.launch();
	}

	launch() {
		this.draw(this.gridModel);
		window.requestAnimationFrame(() => this.launch());
	}

	setSize() {
		this.viewport.width = this.viewport.clientWidth;
		this.viewport.height = this.viewport.clientHeight;
		this.gl.viewport(
			0,
			0,
			this.gl.drawingBufferWidth,
			this.gl.drawingBufferHeight
		);
	}

	init() {
		this.viewport = document.createElement('CANVAS');
		this.viewport.className = 'viewport';

		const gl = this.viewport.getContext('webgl2');
		//gl.clearColor(1.0, 1.0, 1.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		gl.clear(gl.COLOR_BUFFER_BIT);
		this.gl = gl;
	}

	createModel(vertices, indices, stride, mode, program) {
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

		return {
			vertexBuffer: vertexBuffer,
			indexBuffer: indexBuffer,
			indexCount: indices.length,
			stride: stride,
			mode: mode,
			program: program,
		};
	}

	draw(
		model,
		position = [0, 0, 0],
		color = [0, 0, 0],
		programName = model.program
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
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);

		if (program.hasOwnProperty('aVertexPosition')) {
			gl.enableVertexAttribArray(program.aVertexPosition);
			gl.vertexAttribPointer(
				program.aVertexPosition,
				3,
				gl.FLOAT,
				false,
				model.stride,
				0
			);
		}

		if (program.hasOwnProperty('aVertexNormal')) {
			gl.enableVertexAttribArray(program.aVertexNormal);
			gl.vertexAttribPointer(
				program.aVertexNormal,
				3,
				gl.FLOAT,
				false,
				model.stride,
				12
			);
		}

		if (program.hasOwnProperty('aTextureCoord')) {
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, model.texture);
			gl.uniform1i(program.uSampler, 0);
			gl.enableVertexAttribArray(program.aTextureCoord);
			gl.vertexAttribPointer(
				program.aTextureCoord,
				2,
				gl.FLOAT,
				false,
				model.stride,
				24
			);
		}

		// Set index buffer
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);

		// Draw
		gl.drawElements(gl[model.mode], model.indexCount, gl.UNSIGNED_SHORT, 0);
	}

	genGrid(size = 10, step = 1) {
		const grid = { v: [], i: [] };

		for (let i = -size / 2; i < size / 2; i += step) {
			grid.v.push(-size / 2 - step * 0.5, 0, i, size / 2 + step * 0.5, 0, i);
			grid.v.push(i, 0, -size / 2 - step * 0.5, i, 0, size / 2 + step * 0.5);
		}
		grid.v.push(
			-size / 2 - step * 0.5,
			0,
			size / 2,
			size / 2 + step * 0.5,
			0,
			size / 2
		);
		grid.v.push(
			size / 2,
			0,
			-size / 2 - step * 0.5,
			size / 2,
			0,
			size / 2 + step * 0.5
		);

		for (let j = 0; j < grid.v.length / 3; j++) grid.i.push(j);

		return grid;
	}
}
