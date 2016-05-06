'use strict';

var PS = PS || {};

PS.TwitchView = function (model) {
	var self = this;
	// Possible User Actions
	self.searchStarted = new PS.Event(self);
	self.nextPageClicked = new PS.Event(self);
	self.prevPageClicked = new PS.Event(self);
	
	// Attach handlers to HTML Elements to fire off the events when they happen
	
	self._model = model;
	// Attach a handler to the model's loaded event (So we can update the view when the model changes)
	self._model.loaded.register(function () {
		self.show();
	});
};
PS.TwitchView.prototype.show = function () {
	// Read the Model and render the view (Super Primitive Template Engine)
};