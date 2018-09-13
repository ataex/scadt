export default async function Palette(engine) {
	const palette = {};
	const r = await engine.loadStatic('./test.obj');
	const o = engine.parseObj(r);
	for (const name in o) palette[name] = engine.createModel(o[name]);

	return Object.freeze(palette);
}
