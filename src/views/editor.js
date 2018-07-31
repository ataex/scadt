'use strict';

import m from 'mithril';
import LeftPanel from '../components/left-panel.js';

export default class Editor {
	constructor(engine) {
		this.engine = engine;
	}

	view() {
		return m('.editor.view', [m(LeftPanel), m('menu')]);
	}

	oncreate() {
		document.querySelector('.editor.view').appendChild(this.engine.viewport);
		this.engine.setSize();
	}

	onremove() {}
}
