import './styles/main.less';
import m from 'mithril';

import Core from './core/core';
import EditorView from './views/editor.js';
import AboutView from './views/about.js';

const core = new Core();

m.route(document.body, '/', {
	'/': { view: () => m(EditorView, { core }) },
	'/about': AboutView,
});
