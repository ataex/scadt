import m from 'mithril';

export default class StatusBar {
	view(vnode) {
		return m('.status.bar', 'Mode: ' + vnode.attrs.core.mode());
	}
}
