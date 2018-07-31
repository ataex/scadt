import v from './shaders/v.js';
import vn from './shaders/vn.js';

export default class ProgramManager {
	constructor(gl) {
		this.gl = gl;
		this.v = this.initProgram(v);
		this.vn = this.initProgram(vn);
	}

	initProgram(rawProgram) {
		const gl = this.gl;
		const program = gl.createProgram();

		for (const shaderType in rawProgram) {
			const shader = gl.createShader(gl[shaderType]);
			gl.shaderSource(shader, rawProgram[shaderType]);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				throw new Error(gl.getShaderInfoLog(shader));
			}
			gl.attachShader(program, shader);
		}
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw new Error('Could not initialise shaders');
		}

		// Set shader variables location links
		for (const shaderType in rawProgram) {
			const regexp = /(attribute|uniform)\s.*?\s(.*?);/g;
			let match;

			while ((match = regexp.exec(rawProgram[shaderType])) !== null) {
				if (match[1] == 'attribute') {
					program[match[2]] = gl.getAttribLocation(program, match[2]);
				} else if (match[1] == 'uniform') {
					program[match[2]] = gl.getUniformLocation(program, match[2]);
				}
			}
		}
		return program;
	}
}
