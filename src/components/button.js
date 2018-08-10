import m from 'mithril';
import SvgIcon from './svg-icon';

export default class Button {
	view(vnode) {
		return m('button', { ...vnode.attrs, type: 'button' }, [
			m(SvgIcon, { name: vnode.attrs.icon }),
		]);
	}
}
