export default class ResourceManager {
	constructor(gl) {
		this.gl = gl;
	}

	static importOBJ(file) {
		let name;
		const data = { f: {}, v: [''], t: [''], n: [''], o: {} };
		const regexp2 = /(?:[^og]*^(v)\s)?(?:[^og]*^v(t)\s)?(?:[^og]*^v(n)\s)?/m;
		const regexp = /(?:^[og] +)(\S+)|(?:^f +)(.+)|(v(?=\s)|t|n)\s+(.+)/gm;
		let match;
		while ((match = regexp.exec(file))) {
			if (match[1]) {
				name = match[1];
				data.o[name] = {
					s: 0,
					v: [],
					i: [],
					m: 'TRIANGLES',
					a: file
						.substr(match.index + match[0].length)
						.match(regexp2)
						.slice(1, 4)
						.filter(Boolean),
				};
				data.f[name] = [];
			} else if (match[2]) {
				data.f[name].push(...match[2].match(/\d+/g));
			} else if (match[3]) {
				data[match[3]].push(match[4]);
			}
		}

		for (name in data.f) {
			var f = data.f[name];
			var a = data.o[name].a;
			var v = data.o[name].v;
			var i = data.o[name].i;
			var t;
			for (var fi = 0; fi < f.length; fi += a.length) {
				t = 'v n t';
				for (var ai = 0; ai < a.length; ai++) {
					t = t.replace(a[ai], data[a[ai]][f[fi + ai]]);
				}

				var ii = 0;
				for (var vi = -1; vi < v.length; vi++) {
					if (v[vi] === t) {
						ii = vi;
						break;
					}
				}
				if (ii) {
					i.push(ii);
				} else {
					i.push(v.length);
					v.push(t);
				}
			}
			data.o[name].v = v
				.join()
				.match(/[\d.-]+/g)
				.map(Number);
			data.o[name].a.map(function(k) {
				data.o[name].s += { v: 12, n: 12, t: 8 }[k];
			});
		}
		return data.o;
	}
}
