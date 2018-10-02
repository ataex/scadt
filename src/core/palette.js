export default async function Palette() {
	const palette = {
		furniture: {
			'good chairs': './test.obj',
		},
	};
	/*
	const palette = {};
	const r = await engine.loadStatic('./test.obj');
	const o = engine.parseObj(r);
	for (const name in o) palette[name] = engine.createModel(o[name]);
	*/

	return Object.freeze(palette);
}
