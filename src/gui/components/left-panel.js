import m from 'mithril';
import Button from './button.js';
import FileMenu from './file-menu.js';
import PaletteMenu from './palette-menu.js';
import SettingsMenu from './settings-menu.js';

export default function LeftPanel() {
	return Object.freeze({ view });
}

function view(vnode) {
	return m('.left.panel', [
		m(SettingsMenu),
		m(FileMenu),
		m(PaletteMenu),

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
			title: 'Move object',
			icon: 'move',
			onclick() {
				vnode.attrs.core.mode('move');
			},
		}),
		m(Button, {
			title: 'Rotate object',
			icon: 'rotate',
			onclick() {
				vnode.attrs.core.mode('rotate');
			},
		}),
		m(Button, {
			title: 'Scale object',
			icon: 'scale',
			onclick() {
				vnode.attrs.core.mode('scale');
			},
		}),
	]);
}
