import m from 'mithril';
import SvgIcon from './svgIcon';

export default class Button {
	view(vnode) {
		return m('button', { ...vnode.attrs, type: 'button' }, [
			m(SvgIcon, { name: vnode.attrs.icon }),
		]);
	}
}
