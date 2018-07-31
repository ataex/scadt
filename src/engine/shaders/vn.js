export default {
	VERTEX_SHADER: `
		attribute vec3 aVertexPosition;
		attribute vec3 aVertexNormal;
		
		uniform vec3 uObjectColor;
		
		uniform mat4 uMMatrix;
		uniform mat4 uPVMatrix;
		uniform mat4 uNMatrix;
		
		varying vec3 vLighting;
		varying vec3 vObjectColor;
		
		void main(void) {
			gl_Position = uPVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
			vObjectColor = uObjectColor/255.0;
			
			vec3 ambientLight = vec3(0.6, 0.6, 0.6);
			vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);
			vec3 directionalVector = vec3(0.85, 0.8, 0.75);
			
			vec4 transformedNormal = uNMatrix * vec4(aVertexNormal, 1.0);
			
			float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
			vLighting = ambientLight + (directionalLightColor * directional);
		}
	`,

	FRAGMENT_SHADER: `
		precision mediump float;
		varying vec3 vObjectColor;
		varying vec3 vLighting;
		void main(void) {
			gl_FragColor = vec4(vObjectColor.rgb * vLighting, 1.0);
		}
	`,
};

/*
Engine.prototype.shaders = {


a = `

		FRAGMENT_SHADER :
			precision mediump float;
			varying vec3 vObjectColor;
			varying vec3 vLighting;
			void main(void) {
				gl_FragColor = vec4(vObjectColor.rgb * vLighting, 1.0);
			}
		


`


*/
