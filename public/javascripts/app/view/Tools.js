define([
	'jquery',
	'app/model/DrawState',
	'app/view/View',
	'app/view/DrawTool',
	'app/view/FuncTool'
	], function($, DrawState, View, DrawTool, FuncTool) {
		var Tools = View.extend({
			btnsElm : undefined,
			opneBtnElm : undefined,
			initialize : function() {
				this.btnsElm = this.$('.btn-container');
				this.opneBtnElm = this.$('.btn-tools-open');
				this.btnInit();
			},
			events : {
				'click .close' : 'closeTools'
			},
			btnInit : function() {
				var drawState = new DrawState();
				var penciBtnl = new DrawTool({
					name : 'pencil',
					el : '#pencil-btn',
					model : drawState
				});
				var eraserBtn = new DrawTool({
					name : 'eraser',
					el : '#eraser-btn',
					model : drawState
				});
				var colorBtn = new DrawTool({
					name : 'color',
					el : '#color-btn',
					model : drawState
				});
				var thicknessBtn = new DrawTool({
					name : 'thickness',
					el : '#thickness-btn',
					model : drawState
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
			},
			closeTools : function() {
				this.hide();
			}
		});

		return Tools;
});