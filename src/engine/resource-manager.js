export default class ResourceManager {
	constructor(gl) {
		this.gl = gl;
	}

	parseObj(str) {
		const data = { v: [null], vt: [null], vn: [null] };
		const objects = {};
		let object;

		const regexp = /^(?:(v|vt|vn)|(o|g)|(f)) (.*)/gm;
		let match;
		while ((match = regexp.exec(str))) {
			if (match[1]) data[match[1]].push(match[4]);
			else if (match[2]) object = objects[match[4]] = { f: [], v: [], i: [] };
			else if (match[3]) object.f.push(...match[4].split(' '));
		}

		for (const name in objects) {
			//Convert face information to vertices
			objects[name].f.forEach((f) => {
				f = f.split('/');
				objects[name].v.push(
					(f[0] ? data.v[f[0]] : '') +
						(f[2] ? ' ' + data.vn[f[2]] : '') +
						(f[1] ? ' ' + data.vt[f[1]] : '')
				);
			});
			//Remove duplicate vertices and fill indicec array
			objects[name] = objects[name].v.reduce(
				(acc, v, i, arr) => {
					let di = arr.slice(0, i).indexOf(v);
					if (di !== -1) acc.indices.push(di);
					else {
						acc.indices.push(acc.vertices.length);
						acc.vertices.push(v);
					}
					return acc;
				},
				{ vertices: [], indices: [] }
			);
			//Convert vertices from string to numbers
			objects[name].vertices = objects[name].vertices
				.join()
				.match(/[\d.-]+/g)
				.map(Number);
			objects[name].pack = 'pppnnn';
			objects[name].mode = 'TRIANGLES';
		}
		return objects;
	}
}
