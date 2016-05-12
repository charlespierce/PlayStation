'use strict';

var PS = PS || {};

// Simple implementation of an Event system, allows other objects to register event callbacks
PS.Event = function (sender) {
	this._sender = sender;
	this._handlers = [];
};
PS.Event.prototype.trigger = function (arg) {
	for (var i = 0; i < this._handlers.length; i++) {
		this._handlers[i](this._sender, arg);
	}
};
PS.Event.prototype.register = function (handler) {
	this._handlers.push(handler);
};
