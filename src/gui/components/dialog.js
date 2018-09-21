import m from 'mithril';

export default function Dialog() {
	return Object.freeze({
		view,
		oncreate,
	});
}

function view() {
	return m('.dialog', { tabindex: 0, onfocusout }, 'dialog');
}

function oncreate(vnode) {
	vnode.dom.focus();
}

function onfocusout() {
	m.mount(document.querySelector('.modal'), null);
}
