import m from 'mithril';

export default function Menu() {
	return Object.freeze({
		view(vnode) {
			return m('.menu', vnode.children);
		},
	});
}
