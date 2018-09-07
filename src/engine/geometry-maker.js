export default function initGeometryMaker() {
	return Object.freeze({ origin, genGrid });
}

function origin() {
	return {
		mode: 'LINES',
		layout: 'pppccc',
		// prettier-ignore
		vertices: [
			0, 0, 0, 255, 0, 0,
			1, 0, 0, 255, 0, 0,
			0, 0, 0, 0, 255, 0,
			0, 1, 0, 0, 255, 0,
			0, 0, 0, 0, 0, 255,
			0, 0, 1, 0, 0, 255,
		],
		indices: [0, 1, 2, 3, 4, 5],
	};
}

function genGrid(size = 10, step = 1) {
	const v = [];
	const i = [];

	for (let i = -size / 2; i < size / 2; i += step) {
		v.push(-size / 2 - step * 0.5, 0, i, size / 2 + step * 0.5, 0, i);
		v.push(i, 0, -size / 2 - step * 0.5, i, 0, size / 2 + step * 0.5);
	}
	//prettier-ignore
	v.push(
		-size / 2 - step * 0.5, 0, size / 2,
		size / 2 + step * 0.5, 0, size / 2
	);
	//prettier-ignore
	v.push(
		size / 2, 0, -size / 2 - step * 0.5,
		size / 2, 0, size / 2 + step * 0.5
	);

	for (let j = 0; j < v.length / 3; j++) i.push(j);
	return {
		vertices: v,
		indices: i,
		mode: 'LINES',
		layout: 'ppp',
	};
}
