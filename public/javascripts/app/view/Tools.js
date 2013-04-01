define([
	'jquery',
	'app/view/View',
	'app/view/DrawTool',
	'app/view/FuncTool',
	'app/view/Button'
	], function($, View, DrawTool, FuncTool, Button) {
		var Tools = View.extend({
			initialize : function() {
				var self = this;
				this.btnsElm = this.$('.btn-container');
				this.opneBtnElm = this.$('.btn-tools-open');
				this.collection.on('add', this._updateFuncBtns.bind(this));
				this._btnInit();
				this._updateFuncBtns();
			},
			events : {
				'click .btn-tools-close' : 'closeTools',
				'click .btn-tools-open' : 'openTools'
			},
			openTools : function() {
				this.btnsElm.show();
			},
			closeTools : function() {
				this.btnsElm.hide();
			},
			_btnInit : function() {
				this.penciBtnl = new DrawTool({
					name : 'pencil',
					el : '#pencil-btn',
					model : this.model
				});
				this.eraserBtn = new DrawTool({
					name : 'eraser',
					el : '#eraser-btn',
					model : this.model
				});
				this.colorBtn = new DrawTool({
					name : 'color',
					el : '#color-btn',
					model : this.model
				});
				this.thicknessBtn = new DrawTool({
					name : 'thickness',
					el : '#thickness-btn',
					model : this.model
				});
				this.undoBtn = new FuncTool({
					name : 'undo',
					el : '#undo-btn'
				});
				this.redoBtn = new FuncTool({
					name : 'redo',
					el : '#redo-btn'
				});
				this.clearBtn = new FuncTool({
					name : 'clear',
					el : '#clear-btn'
				});
				this.saveBtn = new FuncTool({
					name : 'save',
					el : '#save-btn'
				});
				this.openBtn = new Button({
					name : 'open',
					el : '.btn-tools-open'
				});
			},
			_updateFuncBtns: function(e) {
				var n = this.collection.length;

				if (n) {
					this.undoBtn.enable();
				}else {
					this.undoBtn.disable();
				}

				if (this.collection.counter === n) {
					this.redoBtn.disable();
				}else {
					this.redoBtn.enable();
				}
			}
		});

		return Tools;
});