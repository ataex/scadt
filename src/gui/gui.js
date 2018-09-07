import './styles/main.less';
import m from 'mithril';

import EditorView from './views/editor.js';
import AboutView from './views/about.js';

export default function Gui(engine, core) {
	m.route(document.body, '/', {
		'/': { view: () => m(EditorView, { engine, core }) },
		'/about': AboutView,
	});
}
