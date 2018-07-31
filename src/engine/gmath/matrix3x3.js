export default class matrix3x3 {
	static initFromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
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
}
