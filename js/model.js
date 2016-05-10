'use strict';
var PS = PS || {};

PS.TwitchModel = function () {
	var self = this;
	self.loaded = new PS.Event(this);

	self.streams = [];
	self.page = 1;
	self.totalStreams = 0;
	self.itemsPerPage = 10;

	// Create Handler for use with JSONP Requests
	// Possible improvement: Generate a unique ID to use as the property name and store that, so that many Models can coexist
	PS.TwitchAPIResponse = function (data) {
		self._parseResult(data);
	};
};
PS.TwitchModel.prototype = {
	pageCount: function () {
		return this.totalStreams == 0 ? 0 : Math.ceil(this.totalStreams / this.itemsPerPage);
	},
	nextPage: function () {
		return (this.page + 1) % (this.pageCount() + 1);
	},
	prevPage: function () {
		return this.page - 1;
	},
	goToPage: function (pageNo) {
		this.page = pageNo;
		this._submitQuery(this._query, pageNo);
	},
	findStreams: function (query) {
		// For a new search, reset the page counter to 1, since we want to start on the first page
		this._query = query;
		this.page = 1;
		this._submitQuery(query, 0);
	},
	_submitQuery: function (query, pageNo) {
		if (query) {
			// Perform JSONP Request to Twitch API
			var url = 'https://api.twitch.tv/kraken/search/streams?callback=PS.TwitchAPIResponse&q=';
			url += encodeURIComponent(query);
			url += '&limit=' + this.itemsPerPage;
			if (pageNo > 1) {
				url += '&offset=' + ((pageNo - 1) * this.itemsPerPage);
			}
			url += '&nocache=' + (new Date()).getTime();
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url;
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(script);
			head.removeChild(script);
		} else {
			// There is no query string to generate, so reset everything to zero and announce the change
			this.page = 1;
			this.totalStreams = 0;
			this.streams.length = 0;
			this.loaded.trigger();
		}
	},
	_parseResult: function (data) {
		// Note: There is a known issue with the Twitch API wherein /search/streams will not return all streams
		//	in the list, even though the total count is correct
		this.totalStreams = data._total;
		// Reload streams array with list from response
		this.streams.length = 0;
		for (var i = 0; i < data.streams.length; i++) {
			this.streams.push(new PS.TwitchStreamModel(data.streams[i]));
		}
		this.loaded.trigger();
	}
};

PS.TwitchStreamModel = function (streamData) {
	this.displayName = streamData.channel.display_name;
	this.game = streamData.game;
	this.viewers = streamData.viewers;
	this.description = streamData.channel.status;
	this.preview = streamData.preview.medium;
};
