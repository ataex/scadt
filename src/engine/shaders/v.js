export default {
	VERTEX_SHADER: `
		attribute vec3 aVertexPosition;
		
		uniform vec3 uObjectColor;
		uniform mat4 uMMatrix;
		uniform mat4 uPVMatrix;
		
		varying vec3 vObjectColor;
		
		void main(void) {
			gl_Position = uPVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
			vObjectColor = uObjectColor/255.0;
		}
	`,

	FRAGMENT_SHADER: `
		precision mediump float;
		varying vec3 vObjectColor;
		void main(void) {
			gl_FragColor = vec4(vObjectColor, 1.0);
		}
	`,
};
