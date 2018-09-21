import m from 'mithril';
import Button from './button.js';

export default function Menu() {
	return Object.freeze({ view });
}

function view(vnode) {
	return m(`.menu${vnode.attrs.collapsed ? '.collapsed' : ''}`, [
		m(Button, {
			title: vnode.attrs.title,
			icon: vnode.attrs.icon,
			onclick() {
				this.parentNode.classList.toggle('collapsed');
			},
		}),
		m('.content', vnode.children),
	]);
}
