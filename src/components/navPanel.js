import m from 'mithril';

export default class NavPanel {
	view() {
		return m('nav', [
			m('a[href=/]', { oncreate: m.route.link }, ['editor']),
			m('a[href=/about]', { oncreate: m.route.link }, ['about']),
		]);
	}
}
