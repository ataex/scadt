import m from 'mithril';
import SvgIcon from './svg-icon.js';

export default function Tree() {
	return {
		view({ attrs: { name, model, children, content, params } }) {
			if (!name) model = { [name]: model };

			return m(children ? '.leaf' : !name ? '.branch' : '.branch.collapsed', [
				m(
					'.title',
					{
						onclick() {
							this.parentNode.classList.toggle('collapsed');
						},
					},
					[
						m(SvgIcon, { glyph: children ? 'leaf' : 'branch' }),
						m('.label', name),
					]
				),
				m(
					'.content',
					children
						? m(children, { model, name, ...params })
						: Object.keys(model[name]).reduce((res, key) => {
							res.push(
								m(Tree, {
									name: key,
									model: model[name],
									children: content(model[name], key),
									content,
									params,
								})
							);
							return res;
						  }, [])
				),
			]);
		},
	};
}
