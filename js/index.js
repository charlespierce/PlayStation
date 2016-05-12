(function () {
	// Set up the Model, View and Controller and start the app working
	var model = new PS.TwitchModel();
	var view = new PS.TwitchView(model);
	var controller = new PS.TwitchController(model, view);
	view.show();

	var first = document.querySelector('input');
	if (first && first.focus) first.focus();
})();
