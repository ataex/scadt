/**
 * @file Ui.
 * @author Viktor Shestakov
 */

import SGui from "./engine/sgui.js";

/** Ui class */
export default class Ui {
	/**
	 * 
	 * @param {Editor} editor - Instance of editor.
	 * @param {Object} container - Instance of container for editor.
	 * @param {Object} viewport - Viewport object.
	 * @param {String} language=ru - Language identefier.
	 */
	constructor(editor, container, viewport, language='ru') {
		this.editor = editor;
		this.engine = editor.engine;
		
		this.layout = this.initLayout(container);
		this.viewport = this.initViewport(viewport);
		
		this.initLeftArea();
		
		return this
	}
	
	
	/**
	 * Initialize layout (simple div) for editor ui elements.
	 * @param {Object} container - Container element.
	 */
	initLayout(container) {
		var layout = document.createElement('div');
		layout.className = 'layout';
		container.appendChild(layout);
		return layout;
	}
	
	/**
	 * Initialize viewport of editor.
	 * @param {Object} viewport - Html canvas element with configured context.
	 */
	initViewport(viewport) {
		this.layout.appendChild(viewport);
		setTimeout(function(){viewport.set()},1);
		viewport.addEventListener('mousedown',   (e) => this.editor.mouseDown(e));
		viewport.addEventListener('mouseup',     (e) => this.editor.mouseUp(e));
		viewport.addEventListener('mousemove',   (e) => this.editor.mouseMove(e));
		viewport.addEventListener('wheel',       (e) => this.editor.mouseWheel(e));
		viewport.addEventListener('contextmenu', (e) => this.editor.contextMenu(e));
		return viewport;
	}
	
	
	
	initLeftArea() {
		var area = document.createElement('div');
		area.className = 'left area';
		this.layout.appendChild(area);
		
		area.appendChild(this.initViewPanel());
		area.appendChild(this.initManipulationPanel());
	}
	
	
	initViewPanel(){
		var p = SGui.initPanel('vertical');
		
		//p.appendChild(SGui.initButton('save'));
		
		p.appendChild(SGui.initButton('fullscreen', () => this.editor.fullscreen(this.editor)));
		
		p.appendChild(SGui.initButton('projection', (e) => this.editor.changeProjection(e)));
		
		return p;
	}
	
	initManipulationPanel() {
		var p = SGui.initPanel('vertical');
		
		var paletteBtn = SGui.initButton('palette');
		p.appendChild(paletteBtn);
		
		var paletteTree = SGui.initTree('palette');
		
		paletteTree.addEventListener('click',(e) => {
			var elm = e.target;
			if (elm.classList.contains('item')){
				this.editor.putObject(elm.getAttribute('value'));
			}
		});
		
		paletteBtn.appendChild(paletteTree);
		
		p.appendChild(SGui.initButton('move'));
		//p.appendChild(SGui.initButton('rotate'));
		//p.appendChild(SGui.initButton('scale'));
		
		return p
	}
	
	
}

