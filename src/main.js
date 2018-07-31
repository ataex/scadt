import './styles/main.less';
import m from 'mithril';

import Engine from './engine/engine.js';
import Core from './core/core';
import EditorView from './views/editor.js';
import AboutView from './views/about.js';

const engine = new Engine();
const core = new Core(engine);

m.route(document.body, '/', {
	'/': new EditorView(engine),
	'/about': AboutView,
});
