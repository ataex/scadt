import Engine from './engine/engine.js';
import Core from './core/core.js';
import Gui from './gui/gui.js';

(async () => {
	const engine = Engine();
	const core = await Core(engine);
	Gui(engine, core);
})();
