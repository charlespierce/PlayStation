'use strict';

var PS = PS || {};

PS.TwitchModel = function () {
	var self = this;
	self.loaded = new PS.Event(this);
	
	self.streams = [];
	self.page = 0;
	self.totalStreams = 0;
	self.itemsPerPage = 10;
	
	// Create Handler for use with the JSONP Requests
	PS.TwitchAPIResponse = function (data) {
		self.totalStreams = data._total;
		// Reload streams array with list from response
		alert(JSON.stringify(data.streams));
		self.loaded.trigger();
	};
};
PS.TwitchModel.prototype.pageCount = function () {
	return this.itemsPerPage == 0 ? 0 : Math.ceil(this.totalStreams / this.itemsPerPage);
};
PS.TwitchModel.prototype.goToPage = function (pageNo) {
	this.page = pageNo;
	this._submitQuery(this._query, pageNo);
};
PS.TwitchModel.prototype.findStreams = function (query) {
	this._query = query;
	this.page = 0;
	this._submitQuery(query, 0);
};
PS.TwitchModel.prototype._submitQuery = function (query, pageNo) {
	// Perform JSONP Request to Twitch API
	var url = 'https://api.twitch.tv/kraken/search/streams?callback=PS.TwitchAPIResponse&q=';
	url += encodeURIComponent(query);
	url += '&limit=' + this.itemsPerPage;
	if (pageNo > 0) {
		url += '&offset=' + ((pageNo - 1) * this.itemsPerPage);
	}
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	document.getElementsByTagName('head')[0].appendChild(script);
};