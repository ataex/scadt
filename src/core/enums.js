/**
 * @file Enumerations for program.
 * @author Viktor Shestakov
 */

/**
 * Availeable modes of editor.
 * @enum {number}
 */
export const MODE = {
	/** Selecting mode. */
	SELECT: "select",
	/** Mode for creating objects. */
	MOVE: "move",
	/***/
	PLACE: "place",
	/** Mode for creating walls. */
	WALL: "wall",
}

/**
 * Categories of objects in program.
 * @enum {number}
 */
const CATEGORY = {
	/** Machines. */
	MACHINE: 1,
	/** Sources of lights. */
	LIGHT: 2,
	/** Helpers. */
	HELPER: 5,
}
