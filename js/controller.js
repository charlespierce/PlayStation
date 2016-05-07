'use strict';

var PS = PS || {};

PS.TwitchController = function (model, view) {
	// Ridiculously simple controller, could technically be replaced by having the view call model methods directly.
	// However, that choice limits future development decisions and makes the view harder to test.
	view.searchStarted.register(function (sender, query) {
		model.findStreams(query);
	});
	view.pagerClicked.register(function (sender, pageNo) {
		model.goToPage(pageNo);
	});
};