import m from 'mithril';
import Button from './button.js';

export default class LeftPanel {
	view() {
		return m('.left.panel', [
			m(Button, {
				icon: 'folder',
				onclick: () => {
					document.querySelector('#file-upload').click();
				},
			}),
			m(Button, { icon: 'home' }),
			m('input', { id: 'file-upload', type: 'file', hidden: true }),
		]);
	}
}
