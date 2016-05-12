'use strict';

var PS = PS || {};

PS.TwitchController = function (model, view) {
	// Ridiculously simple controller, could technically be replaced by having the view call model methods directly.
	// However, that choice would limit future development decisions
	view.searchStarted.register(function (sender, query) {
		model.findStreams(query);
	});
	view.pagerClicked.register(function (sender, pageNo) {
		model.goToPage(pageNo);
	});
};
