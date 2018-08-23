import m from 'mithril';
import LeftPanel from '../components/left-panel.js';
import StatusBar from '../components/status-bar.js';

export default class Editor {
	view(vnode) {
		return m('.editor.view', [
			m(LeftPanel, { core: vnode.attrs.core }),
			m(StatusBar, { core: vnode.attrs.core }),
		]);
	}

	oncreate(vnode) {
		const engine = vnode.attrs.core.engine;
		vnode.dom.appendChild(engine.viewport);
		engine.updateViewportSize();
	}
}
