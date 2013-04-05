define([
	'jquery',
	'app/view/View',
	'app/view/DrawTool',
	'app/view/FuncTool',
	'app/view/Button'
	], function($, View, DrawTool, FuncTool, Button) {
		var Tools = View.extend({
			initialize : function(params) {
				var self = this;
				this.canvas= params.canvas;
				this.btnsElm = this.$('.btn-container');
				this.opneBtnElm = this.$('.btn-tools-open');
				this.collection.on('add', this._updateFuncBtns.bind(this));
				this.collection.on('change', this._updateFuncBtns.bind(this));
				this.collection.on('reset', this._updateFuncBtns.bind(this));
				this._btnInit();
				this._updateFuncBtns();
			},
			events : {
				'click .btn-tools-close' : '_closeTools',
				'click .btn-tools-open' : '_openTools',
				'click #clear-btn' : '_clearHandler',
				'click #undo-btn' : '_undoHandler',
				'click #redo-btn' : '_redoHandler',
				'click #save-btn' : '_saveHandler'
			},
			_openTools : function() {
				this.btnsElm.show();
			},
			_closeTools : function() {
				this.btnsElm.hide();
			},
			_btnInit : function() {
				var self = this;
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
				// console.log(n, e.attributes);
				if (n) {
					this.undoBtn.enable();
					this.clearBtn.enable();
					this.saveBtn.enable();
				}else {
					this.undoBtn.disable();
					this.clearBtn.disable();
					this.saveBtn.disable();
				}

				if (this.collection.pathHistory.length) {
					this.redoBtn.enable();
				}else {
					this.redoBtn.disable();
				}
			},
			_clearHandler: function() {
				this.trigger(Tools.TOUCH_CLEAR);
			},
			_undoHandler: function(e) {
				this.trigger(Tools.TOUCH_UNDO);
			},
			_redoHandler: function() {
				this.trigger(Tools.TOUCH_REDO);
			},
			_saveHandler: function() {
				this.trigger(Tools.TOUCH_SAVE);
			}
		},{
			TOUCH_CLEAR : 'TOUCH_CLEAR',
			TOUCH_UNDO : 'TOUCH_UNDO',
			TOUCH_REDO : 'TOUCH_REDO',
			TOUCH_SAVE : 'TOUCH_SAVE'
		});

		return Tools;
});