import m from 'mithril';
import Menu from './menu.js';
import Button from './button.js';

export default function SettingsMenu() {
	return Object.freeze({ view });
}

function view() {
	return m(
		Menu,
		{ title: 'Settings menu', icon: 'settings', collapsed: true },
		[
			m(Button, {
				title: 'Go to fullscreen',
				icon: 'fullscreen',
				onclick() {},
			}),

			m(Button, {
				title: 'Hotkeys',
				icon: 'keyboard',
				onclick() {},
			}),
		]
	);
}
