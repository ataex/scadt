import m from 'mithril';
import LeftPanel from '../components/left-panel.js';

export default class Editor {
	view() {
		return m('.editor.view', [m(LeftPanel)]);
	}

	oncreate(vnode) {
		const engine = vnode.attrs.engine;
		vnode.dom.appendChild(engine.viewport);
		engine.updateViewportSize();
	}
}
