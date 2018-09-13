import Entity from '../engine/entity.js';

export default function Scaffold(engine) {
	return Object.freeze({
		grid: Entity(engine.createModel(engine.geometryMaker.genGrid(10, 0.5))),
		origin: Entity(engine.createModel(engine.geometryMaker.origin())),
	});
}
