import m from 'mithril';

export default class FpsMeter {
	view(vnode) {
		return m('.fps.meter', 'FPS: ' + vnode.attrs.core.fps());
	}
}
