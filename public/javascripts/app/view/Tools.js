define([
	'jquery',
	'app/view/View',
	'app/view/DrawTool',
	'app/view/FuncTool',
	'app/view/Button'
	], function($, View, DrawTool, FuncTool, Button) {
		var Tools = View.extend({
			btnsElm : undefined,
			opneBtnElm : undefined,
			initialize : function() {
				this.btnsElm = this.$('.btn-container');
				this.opneBtnElm = this.$('.btn-tools-open');
				this.btnInit();
			},
			events : {
				'click .btn-tools-close' : 'closeTools',
				'click .btn-tools-open' : 'openTools'
			},
			btnInit : function() {
				var penciBtnl = new DrawTool({
					name : 'pencil',
					el : '#pencil-btn',
					model : this.model
				});
				var eraserBtn = new DrawTool({
					name : 'eraser',
					el : '#eraser-btn',
					model : this.model
				});
				var colorBtn = new DrawTool({
					name : 'color',
					el : '#color-btn',
					model : this.model
				});
				var thicknessBtn = new DrawTool({
					name : 'thickness',
					el : '#thickness-btn',
					model : this.model
				});
				var undoBtn = new FuncTool({
					name : 'undo',
					el : '#undo-btn'
				});
				var redoBtn = new FuncTool({
					name : 'redo',
					el : '#redo-btn'
				});
				var clearBtn = new FuncTool({
					name : 'clear',
					el : '#clear-btn'
				});
				var saveBtn = new FuncTool({
					name : 'save',
					el : '#save-btn'
				});
				var openBtn = new Button({
					name : 'open',
					el : '.btn-tools-open'
				});
			},
			openTools : function() {
				this.btnsElm.show();
			},
			closeTools : function() {
				this.btnsElm.hide();
			}
		});

		return Tools;
});