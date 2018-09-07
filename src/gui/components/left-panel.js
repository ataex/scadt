import m from 'mithril';
import Button from './button.js';

export default class LeftPanel {
	view(vnode) {
		return m('.left.panel', [
			m(Button, {
				icon: 'folder',
				onclick: () => {
					document.querySelector('#file-upload').click();
				},
			}),
			m(Button, {
				icon: 'fullscreen',
				onclick() {
					vnode.attrs.core.mode('select');
				},
			}),
			m(Button, {
				icon: 'move',
				onclick() {
					vnode.attrs.core.mode('move');
				},
			}),
			m(Button, {
				icon: 'rotate',
				onclick() {
					vnode.attrs.core.mode('rotate');
				},
			}),
			m(Button, {
				icon: 'scale',
				onclick() {
					vnode.attrs.core.mode('scale');
				},
			}),
			m('input', { id: 'file-upload', type: 'file', hidden: true }),
		]);
	}
}
