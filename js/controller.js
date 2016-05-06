'use strict';

var PS = PS || {};

PS.TwitchController = function (model, view) {
	view.searchStarted.register(function (sender, query) {
		model.findStreams(query);
	});
	var pageClicker = function (sender, newPage) {
		model.goToPage(newPage);
	};
	view.nextPageClicked.register(pageClicker);
	view.prevPageClicked.register(pageClicker);
};