import Entity from '../engine/entity.js';
import geometryMaker from '../engine/utility/geometry-maker.js';

export default function Scaffold(engine) {
	return Object.freeze({
		grid: Entity(engine.createModel(geometryMaker.genGrid(10, 0.5))),
		origin: Entity(engine.createModel(geometryMaker.origin())),
	});
}
