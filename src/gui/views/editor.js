import m from 'mithril';
import LeftPanel from '../components/left-panel.js';
import StatusBar from '../components/status-bar.js';
import FpsMeter from '../components/fps-meter.js';

export default function Editor() {
	return Object.freeze({
		view,
		oncreate,
	});
}

function view(vnode) {
	return m('.editor.view', [
		m(LeftPanel, { core: vnode.attrs.core }),
		m(StatusBar, { core: vnode.attrs.core }),
		m(FpsMeter, { core: vnode.attrs.core }),
		m('.modal'),
	]);
}

function oncreate(vnode) {
	const engine = vnode.attrs.engine;
	vnode.dom.appendChild(engine.viewport);
	engine.updateViewportSize();
}
