import m from 'mithril';

export default function FpsMeter() {
	return Object({ view });
}

function view(vnode) {
	return m('.fps.meter', 'FPS: ' + vnode.attrs.core.fps());
}
