import m from 'mithril';
import Menu from './menu.js';
import Button from './button.js';

export default function FileMenu() {
	return Object.freeze({ view });
}

function view() {
	return m(Menu, { title: 'File menu', icon: 'file', collapsed: true }, [
		m(Button, {
			title: 'Save project',
			icon: 'floppy',
			onclick() {},
		}),
		m(Button, {
			title: 'Clear the project',
			icon: 'bin',
			onclick() {},
		}),
	]);
}
