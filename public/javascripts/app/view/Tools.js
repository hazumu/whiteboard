define([
	'jquery',
	'app/view/View',
	'app/view/DrawTool',
	'app/view/FuncTool',
	'app/view/Button'
	], function($, View, DrawTool, FuncTool, Button) {
		var Tools = View.extend({
			drawBtns: undefined,
			funcBtns: undefined,
			initialize : function(params) {
				var self = this;
				this.canvas= params.canvas;
				this.btnsElm = this.$('.btn-container');
				this.opneBtnElm = this.$('.btn-tools-open');
				this.collection.on('add', this._updateFuncBtns.bind(this));
				this.collection.on('change', this._updateFuncBtns.bind(this));
				this.collection.on('reset', this._updateFuncBtns.bind(this));
				this.model.on("change", this._updateDrawBtns.bind(this));
				this._btnInit();
				this._updateFuncBtns();
			},
			events : {
				'click .btn-tools-close' : '_closeTools',
				'click .btn-tools-open' : '_openTools',
				'click #clear-btn' : '_clearHandler',
				'click #undo-btn' : '_undoHandler',
				'click #redo-btn' : '_redoHandler',
				'click #save-btn' : '_saveHandler',
				'click .draw-tool-container button' : '_changeTypeHandler'
			},
			_openTools : function() {
				this.btnsElm.show();
			},
			_closeTools : function() {
				this.btnsElm.hide();
			},
			_btnInit : function() {
				var self = this;
				this.drawBtns = {};
				this.drawBtns['pencil'] = new Button({
					name : 'pencil',
					el : '#pencil-btn'
				});
				this.drawBtns['eraser'] = new Button({
					name : 'eraser',
					el : '#eraser-btn'
				});
				this.drawBtns['color'] = new Button({
					name : 'color',
					el : '#color-btn'
				});
				this.drawBtns['thickness'] = new Button({
					name : 'thickness',
					el : '#thickness-btn'
				});

				this.funcBtns = {};
				this.funcBtns['undo'] = new Button({
					name : 'undo',
					el : '#undo-btn'
				});
				this.funcBtns['redo'] = new Button({
					name : 'redo',
					el : '#redo-btn'
				});
				this.funcBtns['clear'] = new Button({
					name : 'clear',
					el : '#clear-btn'
				});
				this.funcBtns['save'] = new Button({
					name : 'save',
					el : '#save-btn'
				});
			},
			_updateFuncBtns: function(e) {
				var n = this.collection.length;
				// console.log(n, e.attributes);
				if (n) {
					this.funcBtns['undo'].enable();
					this.funcBtns['clear'].enable();
					this.funcBtns['save'].enable();
				}else {
					this.funcBtns['undo'].disable();
					this.funcBtns['clear'].disable();
					this.funcBtns['save'].disable();
				}

				if (this.collection.pathHistory.length) {
					this.funcBtns['redo'].enable();
				}else {
					this.funcBtns['redo'].disable();
				}
			},
			_updateDrawBtns:function(model) {
				var i = 0,
					keys = Object.keys(this.drawBtns),
					len = keys.length,
					t;

				for(; i < len; i++){
					t = this.drawBtns[keys[i]];
					if (t.name === model.get('type')) {
						t.select();
					}else {
						t.notSelect();
					}
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
			},
			_changeTypeHandler: function(e) {
				var name = e.target.instance ? e.target.instance.name: false;
				if (name) {
					this.trigger(Tools.CHANGE_TOOL_TYPE, name);
				}
			}
		},{
			TOUCH_CLEAR : 'TOUCH_CLEAR',
			TOUCH_UNDO : 'TOUCH_UNDO',
			TOUCH_REDO : 'TOUCH_REDO',
			TOUCH_SAVE : 'TOUCH_SAVE',
			CHANGE_TOOL_TYPE : 'CHANGE_TOOL_TYPE'
		});

		return Tools;
});