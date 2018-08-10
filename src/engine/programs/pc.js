export default {
	VERTEX_SHADER: `
		attribute vec3 aVertexPosition;
		attribute vec3 aVertexColor;
		
		uniform mat4 uMMatrix;
		uniform mat4 uPVMatrix;
		
		varying vec3 vVertexColor;
		
		void main(void) {
			gl_Position = uPVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
			vVertexColor = aVertexColor/255.0;
		}
	`,

	FRAGMENT_SHADER: `
		precision mediump float;
		varying vec3 vVertexColor;
		void main(void) {
			gl_FragColor = vec4(vVertexColor, 1.0);
		}
	`,
};
