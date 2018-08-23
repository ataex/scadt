import m from 'mithril';
import Stream from 'mithril/stream';
import Engine from '../engine/engine.js';

export default class Core {
	constructor() {
		this.engine = new Engine();
		this.palette = {};

		this.mode = Stream('select');
		this.mode.map(m.redraw);

		this.initViewManagement();
		this.prepareScene();
		this.prepare();

		this.launch();
	}

	prepareScene() {
		this.grid = this.engine.createModel(
			this.engine.geometryMaker.genGrid(10, 0.5)
		);
		this.origin = this.engine.createModel(this.engine.geometryMaker.origin());
	}

	async prepare() {
		const r = await this.engine.loadStatic('./test.obj');
		const o = this.engine.objParser.parse(r);
		for (const name in o) this.palette[name] = this.engine.createModel(o[name]);
	}

	launch() {
		this.engine.draw(this.grid, { program: 'p' });
		this.engine.draw(this.origin, { program: 'pc' });
		if (this.palette.chair) this.engine.draw(this.palette.chair, {});
		window.requestAnimationFrame(() => this.launch());
	}

	initViewManagement() {
		const mousewheelStream = Stream();
		this.engine.viewport.addEventListener('mousewheel', mousewheelStream);

		mousewheelStream.map((e) => {
			this.engine.viewController.zoom(-e.deltaY);
			e.preventDefault();
		});

		const mousemoveStream = Stream();
		this.engine.viewport.addEventListener('mousemove', mousemoveStream);

		const mousemovePairStream = Stream.scan(
			(acc, value) => {
				acc.pe = acc.ce;
				acc.ce = value;
				return acc;
			},
			{ pe: new Event('mousemove'), ce: new Event('mousemove') },
			mousemoveStream
		);

		mousemovePairStream.map(({ pe, ce }) => {
			if (
				((ce.buttons == 4) & ce.shiftKey) |
				((ce.buttons == 1) & ce.shiftKey)
			) {
				this.engine.viewController.move([
					pe.clientX - ce.clientX,
					pe.clientY - ce.clientY,
				]);
			} else if (((ce.buttons == 1) & ce.altKey) | (ce.buttons == 4)) {
				this.engine.viewController.rotate(
					pe.clientX - ce.clientX,
					pe.clientY - ce.clientY
				);
			} else if ((ce.buttons == 1) & ce.ctrlKey) {
				this.engine.viewController.zoom(pe.clientY - ce.clientY);
			}
		});
	}
}
