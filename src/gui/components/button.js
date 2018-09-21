import m from 'mithril';
import SvgIcon from './svg-icon';

export default function Button() {
	return Object.freeze({ view });
}

function view(vnode) {
	return m(
		'.button',
		{ title: vnode.attrs.title, onclick: vnode.attrs.onclick },
		[m(SvgIcon, { name: vnode.attrs.icon })]
	);
}
