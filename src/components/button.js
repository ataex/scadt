import m from 'mithril';
import SvgIcon from './svg-icon';

export default class Button {
	view(vnode) {
		return m('.button', { onclick: vnode.attrs.onclick }, [
			m(SvgIcon, { name: vnode.attrs.icon }),
		]);
	}
}
