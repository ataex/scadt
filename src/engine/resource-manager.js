export default class ResourceManager {
	constructor(gl) {
		this.gl = gl;
	}

	parseObj(str) {
		const data = { v: [null], vt: [null], vn: [null], f: {}, null: {} };
		let object;
		let match;

		const regexp = /^(?:(v|vt|vn)|(o)|(f)) (.*)/gm;
		while ((match = regexp.exec(str))) {
			if (match[1]) data[match[1]].push(match[4]);
			else if (match[2]) {
				const k = match.input
					.substring(match.index)
					.match(/^o(?:[^](?!\no))+(?:\n(f))/);
				object = data[k ? k[1] : k][match[4]] = [];
			} else if (match[3]) object.push(...match[4].split(' '));
		}

		const objects = {};
		for (const name in data.f) {
			//Extract vertex layout
			const v = data.f[name][0].split('/');
			const layout =
				(v[0] ? 'ppp' : '') + (v[2] ? 'nnn' : '') + (v[1] ? 'tt' : '');

			const vertices = [];
			//Convert face information to vertices
			data.f[name].forEach((f) => {
				const i = f.split('/');
				vertices.push(
					(i[0] ? data.v[i[0]] : '') +
						(i[2] ? ' ' + data.vn[i[2]] : '') +
						(i[1] ? ' ' + data.vt[i[1]] : '')
				);
			});

			//Remove duplicate vertices and fill indices array
			objects[name] = vertices.reduce(
				(object, vertex) => {
					let di = object.vertices.indexOf(vertex);
					if (di !== -1) object.indices.push(di);
					else {
						object.indices.push(object.vertices.length);
						object.vertices.push(vertex);
					}
					return object;
				},
				{ vertices: [], indices: [], mode: 'TRIANGLES', layout }
			);

			//Convert vertices from string to numbers
			objects[name].vertices = objects[name].vertices
				.join()
				.match(/[\d.-]+/g)
				.map(Number);
		}
		return objects;
	}
}
