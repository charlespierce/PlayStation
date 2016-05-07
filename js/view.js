// Using an IIFE here to provide a scope for helper functions used by the templating process
(function (PS) {
	'use strict';

	var getValueFromObject = function (obj, param) {
		if (obj && param) {
			var value = obj[param];
			if (typeof value === 'function') {
				value = value();
			}
			if (value && value.replace) {
				value = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
			}
			return value;
		}
		return null;
	};
	var fillTemplate = function (obj, template) {
		if (obj && template) {
			return template.replace(/{{(.*?)}}/g, function (match, p1) {
				return getValueFromObject(obj, p1);
			});
		}
		return null;
	};
	
	PS.TwitchView = function (model) {
		var self = this;
		// Possible User Actions
		self.searchStarted = new PS.Event(self);
		self.pagerClicked = new PS.Event(self);
		
		// Attach handlers to HTML Elements to fire off the events when they happen
		document.addEventListener('click', function (e) {
			self.clickHandler(e);
		});
		document.addEventListener('submit', function (e) {
			self.submitHandler(e);
		});
		
		self._model = model;
		// Attach a handler to the model's loaded event (So we can update the view when the model changes)
		self._model.loaded.register(function () {
			self.show();
		});
	};
	PS.TwitchView.prototype.show = function () {
		// TODO: Hide / Show elements based on whether we even have streams to show. If not, just clear the page out
		// Items are defined by a simple template script that replaces {{value}} with model.value
		var streamList = document.getElementById('streamList');
		var itemTemplate = document.getElementById('streamTemplate');
		
		if (streamList && itemTemplate) {
			var items = '';
			for (var i = 0; i < this._model.streams.length; i++) {
				items += fillTemplate(this._model.streams[i], itemTemplate.innerHTML);
			}
			streamList.innerHTML = items;
		}
		
		// Everything else is handled by pulling the data off the model directly
		var templatedElements = document.querySelectorAll('[data-template]');
		for (var i = 0; i < templatedElements.length; i++) {
			var paramName = templatedElements[i].getAttribute('data-template');
			elem.innerHTML = getValueFromObject(this._model, paramName);
		}
	};
	PS.TwitchView.prototype.clickHandler = function (e) {
		// Simple delegation for elements with the class 'pager'
		if (e.target && e.target.classList && e.target.classList.contains('pager')) {
			var pageNo = e.target.getAttribute('data-page');
			if (pageNo) this.pagerClicked.trigger(pageNo);
			e.preventDefault();
		}
	};
	PS.TwitchView.prototype.submitHandler = function (e) {
		// Simple delegation for elements of type 'form'
		if (e.target && e.target.tagName == 'FORM') {
			var query = e.target.querySelectorAll('[name="query"]')[0];
			if (query) {
				this.searchStarted.trigger(query.value);
			}
			e.preventDefault();
		}
	};
})(PS || {});