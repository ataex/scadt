import m from 'mithril';
import SvgIcon from './svgIcon';

export default class LeftPanel {
	view() {
		return m('menu.left-panel', [
			m('button', {}, m(SvgIcon, { name: 'folder' })),
			m('button', {}, m(SvgIcon, { name: 'home' })),
		]);
	}
}
