import m from 'mithril';
import Menu from './menu.js';
import Tree from './tree.js';

const palette = {
	machines: { lathe: 'lathe' },
	light: { lamp: 'asd', lantern: 'qweqw' },
	buildings: { house: 'house' },
};

export default function FileMenu() {
	return Object.freeze({ view });
}

function view() {
	return m(Menu, { title: 'Palette menu', icon: 'add' }, [
		m(Tree, { model: palette }),
	]);
}
