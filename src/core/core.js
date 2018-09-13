'use strict';
import Stream from 'mithril/stream';
import Behavior from './behavior.js';
import Entity from '../engine/entity.js';
import gm from '../engine/graphics-math.js';
import Palette from './palette.js';
import Scaffold from './scaffold.js';

export default async function Core(engine) {
	const self = {};
	const mode = Stream('rotate');
	const behavior = Behavior(mode);

	initEventsStreams(engine.viewport, self, behavior);
	initViewManagement(engine.viewport, engine.viewController);

	const fps = Stream();
	const frames = Stream();
	initFpsMeter(frames, fps);

	const palette = await Palette(engine);
	const scaffold = Scaffold(engine);
	const scene = initScene(palette);

	const temp = Stream();

	loop({ engine, scaffold, scene, frames });
	return Object.freeze(
		Object.assign(self, {
			behavior,
			engine,
			fps,
			mode,
			palette,
			scaffold,
			temp,
			scene,
			mousePlaneProjection,
		})
	);
}

function loop({ engine, scaffold, scene, frames }) {
	engine.draw({ ...scaffold.grid, program: 'p' });
	engine.draw({ ...scaffold.origin, program: 'pc' });
	scene.forEach((entity) => {
		engine.draw({
			model: entity.model,
			position: entity.position,
			color: entity.selected ? [255, 0, 0] : [200, 200, 200],
			program: 'pn',
		});
	});
	frames(performance.now());
	window.requestAnimationFrame(() => loop({ engine, scaffold, scene, frames }));
}

function initScene(palette) {
	return [
		new Entity(palette.chair, [1, 0, -1]),
		new Entity(palette.chair, [-2, 0, -1]),
		new Entity(palette.chair, [-2, 0, 2]),
		new Entity(palette.chair, [1, 0, 2]),
	];
}

function initFpsMeter(frames, fps) {
	Stream.scan(
		(frames, now) => {
			while (frames.length > 0 && frames[0] <= now - 1e3) {
				frames.shift();
			}
			frames.push(now);
			fps(frames.length);
			return frames;
		},
		[],
		frames
	);
}

function initEventsStreams(canvas, self, behavior) {
	canvas.addEventListener('mousedown', (e) => {
		behavior().mouseDown.bind(self)(e);
	});

	canvas.addEventListener('mouseup', (e) => {
		behavior().mouseUp.bind(self)(e);
	});

	canvas.addEventListener('mousemove', (e) => {
		behavior().mouseMove.bind(self)(e);
	});

	canvas.addEventListener('wheel', (e) => {
		behavior().wheel.bind(self)(e);
	});
}

function initViewManagement(canvas, viewController) {
	canvas.addEventListener('wheel', (e) => {
		viewController.zoom(-e.deltaY);
		e.preventDefault();
	});

	let pe = new Event('mousemove');
	canvas.addEventListener('mousemove', (ce) => {
		if (((ce.buttons == 4) & ce.shiftKey) | ((ce.buttons == 1) & ce.shiftKey)) {
			viewController.move([pe.clientX - ce.clientX, pe.clientY - ce.clientY]);
		} else if (((ce.buttons == 1) & ce.altKey) | (ce.buttons == 4)) {
			viewController.rotate(pe.clientX - ce.clientX, pe.clientY - ce.clientY);
		} else if ((ce.buttons == 1) & ce.ctrlKey) {
			viewController.zoom(pe.clientY - ce.clientY);
		}
		pe = ce;
	});
}

function mousePlaneProjection(e, pn, pp) {
	let x = e.pageX - e.currentTarget.offsetLeft;
	let y = e.pageY - e.currentTarget.offsetTop;

	let n = this.engine.viewController.unProject(x, y, 0);
	let f = this.engine.viewController.unProject(x, y, 1);

	return gm.linePlaneIntersec(n, f, pn, pp);
}
