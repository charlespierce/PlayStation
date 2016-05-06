(function (PS) {
	var model = new PS.TwitchModel();
	var view = new PS.TwitchView(model);
	var controller = new PS.TwitchController(model, view);
	model.findStreams('Magic: The Gatherins');
})(PS);