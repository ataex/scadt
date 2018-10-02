'use strict';

import m from 'mithril';
import glyphs from '../glyphs.js';

export default function SvgIcon() {
	return Object.freeze({ view });
}

function view({ attrs: { glyph, onclick } }) {
	return m(
		'svg.icon',
		{ viewBox: '0 0 24 24', onclick },
		m('path', {
			style: 'fill:currentColor',
			d: glyphs[glyph],
		})
	);
}
