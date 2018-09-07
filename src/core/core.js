'use strict';
import Stream from 'mithril/stream';
import Entity from '../engine/entity.js';
import { Select, Move } from './behavior.js';

export default async function Core(engine) {
	const self = {};

	const streams = initEventsStreams(engine.viewport);

	initViewManagement(streams, engine.viewController);

	const mode = Stream('select');
	const modes = Modes();
	const behavior = Behavior(self, streams, mode, modes);

	const fps = Stream();
	const frames = Stream();

	const palette = await initPalette(engine);
	const scaffold = Scaffold(engine);
	const scene = initScene(palette);

	let temp;

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
		})
	);
}

function Modes() {
	return {
		select: Select(),
		move: Move(),
	};
}

function Behavior(self, streams, mode, modes) {
	const behavior = mode.map((value) => {
		if (!modes.hasOwnProperty(value)) throw new Error('Mode doesn\'t exist');
		return modes[value];
	});

	streams.mouseDown.map((e) => {
		behavior().mouseDown.bind(self)(e);
	});
	streams.mouseUp.map((e) => {
		behavior().mouseUp.bind(self)(e);
	});
	streams.mouseMove.map((e) => {
		behavior().mouseMove.bind(self)(e);
	});
	streams.mouseWheel.map((e) => {
		behavior().mouseWheel.bind(self)(e);
	});

	return behavior;
}

function Scaffold(engine) {
	return Object.freeze({
		grid: engine.createModel(engine.geometryMaker.genGrid(10, 0.5)),
		origin: engine.createModel(engine.geometryMaker.origin()),
	});
}

function loop({ engine, scaffold, scene, frames }) {
	engine.draw(scaffold.grid, { program: 'p' });
	engine.draw(scaffold.origin, { program: 'pc' });
	scene.forEach((entity) => {
		engine.draw(entity.model, {
			position: entity.position,
			program: 'pn',
			color: entity.selected ? [255, 0, 0] : [200, 200, 200],
		});
	});
	frames(performance.now());
	window.requestAnimationFrame(() => loop({ engine, scaffold, scene, frames }));
}

async function initPalette(engine) {
	const palette = {};
	const r = await engine.loadStatic('./test.obj');
	const o = engine.parseObj(r);
	for (const name in o) palette[name] = engine.createModel(o[name]);

	return palette;
}

function initScene(palette) {
	return [
		new Entity(palette.chair, [1, 0, -1]),
		new Entity(palette.chair, [-2, 0, -1]),
		new Entity(palette.chair, [-2, 0, 2]),
		new Entity(palette.chair, [1, 0, 2]),
	];
}

function initFpsMeter() {
	this.fps = Stream();
	this.frames = Stream();

	Stream.scan(
		(frames, now) => {
			while (frames.length > 0 && frames[0] <= now - 1e3) {
				frames.shift();
			}
			frames.push(now);
			this.fps(frames.length);
			return frames;
		},
		[],
		this.frames
	);
}

function initEventsStreams(canvas) {
	const streams = {
		mouseDown: Stream(),
		mouseUp: Stream(),
		mouseWheel: Stream(),
		mouseMove: Stream(),
	};
	streams.mouseMovePair = Stream.scan(
		(acc, value) => {
			acc.pe = acc.ce;
			acc.ce = value;
			return acc;
		},
		{ pe: new Event('mousemove'), ce: new Event('mousemove') },
		streams.mouseMove
	);

	canvas.addEventListener('mousedown', streams.mouseDown);
	canvas.addEventListener('mouseup', streams.mouseUp);
	canvas.addEventListener('mousewheel', streams.mouseWheel);
	canvas.addEventListener('mousemove', streams.mouseMove);

	return streams;
}

function initViewManagement(streams, viewController) {
	streams.mouseWheel.map((e) => {
		viewController.zoom(-e.deltaY);
		e.preventDefault();
	});

	streams.mouseMovePair.map(({ pe, ce }) => {
		if (((ce.buttons == 4) & ce.shiftKey) | ((ce.buttons == 1) & ce.shiftKey)) {
			viewController.move([pe.clientX - ce.clientX, pe.clientY - ce.clientY]);
		} else if (((ce.buttons == 1) & ce.altKey) | (ce.buttons == 4)) {
			viewController.rotate(pe.clientX - ce.clientX, pe.clientY - ce.clientY);
		} else if ((ce.buttons == 1) & ce.ctrlKey) {
			viewController.zoom(pe.clientY - ce.clientY);
		}
	});
}
