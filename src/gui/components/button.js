import m from 'mithril';
import SvgIcon from './svg-icon';

export default function Button() {
	return Object.freeze({
		view({ attrs: { title, icon, onclick } }) {
			return m('.button', { title, onclick }, [m(SvgIcon, { glyph: icon })]);
		},
	});
}
