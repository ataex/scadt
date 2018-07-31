export default class Core {
	constructor(engine) {
		this.engine = engine;
		this.x;
		this.y;
		this.initViewManagment();
	}

	initViewManagment() {
		this.engine.viewport.addEventListener('mousewheel', (e) => {
			this.engine.viewController.zoom(-e.deltaY);
			e.preventDefault();
		});

		this.engine.viewport.addEventListener('mousemove', (e) => {
			const x = this.x;
			const y = this.y;

			if (((e.buttons == 4) & e.shiftKey) | ((e.buttons == 1) & e.shiftKey)) {
				this.engine.viewController.move([x - e.clientX, y - e.clientY]);
			} else if (((e.buttons == 1) & e.altKey) | (e.buttons == 4)) {
				this.engine.viewController.rotate(x - e.clientX, y - e.clientY);
			} else if ((e.buttons == 1) & e.ctrlKey) {
				this.engine.viewController.zoom(y - e.clientY);
			}

			this.x = e.clientX;
			this.y = e.clientY;
		});
	}
}
