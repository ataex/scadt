import m from 'mithril';
import SvgIcon from './svg-icon.js';

export default class Tree {
	view(vnode) {
		return m('.tree', [m(Branch, { label: 'root', model: vnode.attrs.model })]);
	}
}

class Branch {
	view(vnode) {
		const children = Object.keys(vnode.attrs.model).reduce((res, key) => {
			res.push(
				typeof vnode.attrs.model[key] === 'object'
					? m(Branch, { label: key, model: vnode.attrs.model[key] })
					: m(Leaf, { label: key })
			);
			return res;
		}, []);
		return m('.branch', [
			m('.label', vnode.attrs.label),
			m('.content', children),
		]);
	}
}

class Leaf {
	view(vnode) {
		return m('.leaf', [m('.label', vnode.attrs.label)]);
	}
}
