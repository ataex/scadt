/**  */
export default class Entity {
	
	/**
	 * @param {}
	 */
	constructor(model) {
		this.model = model;
		this.color = new Float32Array([0,0,0]);
		this.position = new Float32Array([0,0,0]);
		return this;
	}

}
