import m from 'mithril';
import Tree from './tree.js';
import SvgIcon from './svg-icon.js';

export default function PaletteMenu() {
	return Object.freeze({
		view({ attrs: { core } }) {
			return m(Tree, { model: core.palette, content, params: { core } });
		},
	});
}

function content(model, name) {
	const node = model[name];
	if (typeof node === 'string') {
		return {
			view({ attrs: { model, name, core } }) {
				return m(SvgIcon, {
					glyph: 'download',
					async onclick() {
						const r = await core.engine.loadStatic(model[name]);
						delete model[name];
						const o = core.engine.parseObj(r);

						for (const name in o)
							model[name] = core.engine.createModel(o[name]);
						m.redraw();
					},
				});
			},
		};
	} else if (node.hasOwnProperty('layout')) {
		return {
			view({ attrs: { model, name, core } }) {
				return m(SvgIcon, {
					glyph: 'download',
					async onclick() {
						core.addSceneObject(model[name]);
					},
				});
			},
		};
	}
}
