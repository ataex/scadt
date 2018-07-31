'use strict';

import m from 'mithril';

export default class SvgIcon {
	constructor(vnode) {
		this.d = {
			bin:
				'm 8.5,8.5 v 8 m 6,-8 v 8 m -3,-8 v 8 m -6,-8 v 8 m 0,-14 v -2 h 9 v 2 m -13,3 v -3 h 17 v 3 z m 15,0 v 14 h -13 v -14',
			editor:
				'm 3.493,4.501 h 2.5 M 14.5,14.5 h 2 V 17 M 3.5,7.497 H 6 M 3.5,10.5 H 6 m -2.5,3 H 6 m -2.5,3 H 6 m -2.5,3 h 5 V 1.501 h -5 z M 10.49,5.501 h 4 M 10.5,16.5 h 4 m 0,3 h -4 V 4.501 l 2,-3.001 2,3.001 z',
			home: 'M 10 20 v -6 h 4 v 6 h 5 v -8 h 3 L 12 3 L 2 12 h 3 v 8',
			folder: 'M 2,20 H 22 V 7 H 11 L 8,4 H 2 Z',
		};

		this.name = vnode.attrs.name;
	}

	view() {
		return m(
			'svg.icon',
			{ viewBox: '0 0 24 24' },
			m('path', {
				style: 'fill:currentColor;',
				d: this.d[this.name],
			}),
		);
	}
}
