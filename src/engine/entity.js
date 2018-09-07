export default class Entity {
	constructor(model, position = [0, 0, 0], color = [0, 0, 0]) {
		this.model = model;
		this.color = color;
		this.position = position;
	}
}
