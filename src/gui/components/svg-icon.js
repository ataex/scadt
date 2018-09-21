'use strict';

import m from 'mithril';
import glyphs from '../glyphs.js';

export default function SvgIcon() {
	return Object.freeze({ view });
}

function view(vnode) {
	return m(
		'svg.icon',
		{ viewBox: '0 0 24 24' },
		m('path', { style: 'fill:currentColor', d: glyphs[vnode.attrs.name] })
	);
}
