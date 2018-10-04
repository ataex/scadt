'use strict';

import m from 'mithril';
import SvgIcon from './svg-icon';

export default function Button() {
	return {
		view({ attrs: { title, icon, onclick, group } }) {
			return m(
				'.button',
				{
					title,
					group,
					onclick() {
						onclick.bind(this)();

						const isActive = this.classList.contains('active');
						document
							.querySelectorAll(`.button[group=${group}]`)
							.forEach((el) => {
								if (el !== this) el.classList.remove('active');
							});
						this.classList.toggle('active');
					},
				},
				[m(SvgIcon, { glyph: icon })]
			);
		},
	};
}
