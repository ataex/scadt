import m from 'mithril';

import NavPanel from '../components/nav-panel.js';

export default function IndexView() {
	return Object.freeze({ view });
}

function view() {
	return m('.index.view', [m(NavPanel), m('h1', 'About view')]);
}
