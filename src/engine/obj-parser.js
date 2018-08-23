export default class ObjParser {
	parse(str) {
		const data = this.extractData(str);
		const objects = {};
		for (const name in data.f) {
			const layout = this.extractLayout(data.f[name][0]);
			const vertices = this.extractVertices(data, name);
			const geometry = this.extractGeometry(vertices);

			objects[name] = { ...geometry, mode: 'TRIANGLES', layout };
		}
		return objects;
	}

	extractData(str) {
		const data = { v: [null], vt: [null], vn: [null], f: {}, null: {} };
		let object;
		let match;

		const regexp = /^(?:(v|vt|vn)|(o)|(f)) (.*)/gm;
		while ((match = regexp.exec(str))) {
			if (match[1]) data[match[1]].push(match[4]);
			else if (match[2]) {
				const e = match.input
					.substring(match.index)
					.match(/^o(?:[^](?!\no))+(?:\n(f))/);
				object = data[e ? e[1] : e][match[4]] = [];
			} else if (match[3]) object.push(...match[4].split(' '));
		}
		return data;
	}

	extractLayout(v) {
		v = v.split('/');
		return (v[0] ? 'ppp' : '') + (v[2] ? 'nnn' : '') + (v[1] ? 'tt' : '');
	}

	extractVertices(data, name) {
		const vertices = [];
		data.f[name].forEach((f) => {
			const i = f.split('/');
			vertices.push(
				(i[0] ? data.v[i[0]] : '') +
					(i[2] ? ' ' + data.vn[i[2]] : '') +
					(i[1] ? ' ' + data.vt[i[1]] : '')
			);
		});
		return vertices;
	}

	extractGeometry(vertices) {
		const geometry = vertices.reduce(
			(object, vertex) => {
				let di = object.vertices.indexOf(vertex);
				if (di !== -1) object.indices.push(di);
				else {
					object.indices.push(object.vertices.length);
					object.vertices.push(vertex);
				}
				return object;
			},
			{ vertices: [], indices: [] }
		);
		geometry.vertices = geometry.vertices
			.join()
			.match(/[\d.-]+/g)
			.map(Number);
		return geometry;
	}
}
