import m from 'mithril';

export default function StatusBar() {
	return Object.freeze({ view });
}

function view(vnode) {
	return m('.status.bar', 'Mode: ' + vnode.attrs.core.mode());
}
