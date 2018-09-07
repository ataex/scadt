import m from 'mithril';

import NavPanel from '../components/nav-panel.js';

export default class IndexView {
	view() {
		return m('.index.view', [m(NavPanel), m('h1', 'About view')]);
	}
	oncreate() {}
}
