import m from 'mithril';
import Button from './button.js';
import Menu from './menu.js';
import Palette from './palette-menu.js';

export default function LeftPanel() {
	return Object.freeze({ view });
}

function view({ attrs: { core } }) {
	return m('.left.panel', [
		m('.controls', [
			m(Button, {
				title: 'Settings',
				icon: 'settings',
				group: 'mode',
				onclick() {},
			}),

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
					const container = document.querySelector('.left.panel .view');
					this.classList.contains('active')
						? m.mount(container, null)
						: m.mount(container, {
							view() {
								return m(Palette, { core });
							},
						  });
				},
			}),

			m(Menu, [
				m(Button, {
					title: 'Move object',
					icon: 'move',
					group: 'mode',
					onclick() {
						core.mode('move');
					},
				}),

				m(Button, {
					title: 'Rotate object',
					icon: 'rotate',
					group: 'mode',
					onclick() {
						core.mode('rotate');
					},
				}),
				m(Button, {
					title: 'Scale object',
					icon: 'scale',
					group: 'mode',
					onclick() {
						core.mode('scale');
					},
				}),
			]),
		]),
		m('.view'),
	]);
}
