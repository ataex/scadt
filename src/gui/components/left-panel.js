import m from 'mithril';
import Button from './button.js';
import Palette from './palette-menu.js';

export default function LeftPanel() {
	return Object.freeze({ view });
}

function view({ attrs: { core } }) {
	return m('.left.panel', [
		m('.controls', [
			/*

		m(Button, {
			icon: 'folder',
			onclick() {
				console.log(this);
				m.render(
					this,
					m('input', { id: 'file-upload', type: 'file', hidden: true })
				);
				//document.querySelector('#file-upload').click();
			},
		}),
		*/
			m(Button, {
				title: 'Palette',
				icon: 'add',
				onclick() {
					m.mount(document.querySelector('.left.panel .view'), {
						view() {
							return m(Palette, { core });
						},
					});
				},
			}),

			m(Button, {
				title: 'Move object',
				icon: 'move',
				onclick() {
					core.mode('move');
				},
			}),

			m(Button, {
				title: 'Rotate object',
				icon: 'rotate',
				onclick() {
					core.mode('rotate');
				},
			}),
			m(Button, {
				title: 'Scale object',
				icon: 'scale',
				onclick() {
					core.mode('scale');
				},
			}),
		]),
		m('.view'),
	]);
}
