import m from 'mithril';
import SvgIcon from './svg-icon.js';

export default function Tree() {
	return Object.freeze({ view });
}

function view({ attrs: { model, label = 'root', type = 'branch' } }) {
	return m(`.${type}.collapsed`, [
		m('.label', { onclick: collapse }, [
			m(SvgIcon, { name: `${type}` }),
			label,
		]),
		type === 'branch' && m('.content', {}, foo(model)),
	]);
}

function foo(model) {
	return Object.keys(model).reduce((res, key) => {
		res.push(
			m(Tree, {
				label: key,
				type: typeof model[key] === 'object' ? 'branch' : 'leaf',
				model: model[key],
			})
		);
		return res;
	}, []);
}

function collapse() {
	this.parentNode.classList.toggle('collapsed');
}
