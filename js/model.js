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
	// Production improvement: Generate a unique ID to use as the property name and store that
	//		so that Models can coexist
	PS.TwitchAPIResponse = function (data) {
		self._parseResult(data);
	};
};
PS.TwitchModel.prototype = {
	// The following 3 methods are used to access calculated information about the model
	pageCount: function () {
		return this.totalStreams == 0 ? 0 : Math.ceil(this.totalStreams / this.itemsPerPage);
	},
	nextPage: function () {
		return (this.page + 1) % (this.pageCount() + 1);
	},
	prevPage: function () {
		return this.page - 1;
	},
	// Instruct the model to switch to a specific page
	goToPage: function (pageNo) {
		this.page = pageNo;
		this._submitQuery(this._query, pageNo);
	},
	// Instruct the model to switch to a new search query, switching back to page 1
	findStreams: function (query) {
		this._query = query;
		this.page = 1;
		this._submitQuery(query, 0);
	},
	// Actually perform the JSONP Request to the Twitch API
	_submitQuery: function (query, pageNo) {
		if (query) {
			var url = 'https://api.twitch.tv/kraken/search/streams?callback=PS.TwitchAPIResponse&q=';
			url += encodeURIComponent(query);
			url += '&limit=' + this.itemsPerPage;
			if (pageNo > 1) {
				url += '&offset=' + ((pageNo - 1) * this.itemsPerPage);
			}
			// Add a semi-unique string of numbers to the query to prevent the browser from caching the results
			url += '&nocache=' + (new Date()).getTime();
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url;
			script.setAttribute('charset', 'utf-8');
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
	// Handle pulling the JSON data returned by the Twitch API into the model
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

// Sub-Model representing information about a single stream
PS.TwitchStreamModel = function (streamData) {
	this.displayName = streamData.channel.display_name;
	this.game = streamData.game;
	this.viewers = streamData.viewers;
	this.description = streamData.channel.status;
	this.preview = streamData.preview.medium;
	this.url = streamData.channel.url;
};
