chrome.storage = {
	local: {
		data: [],
		get: function(key, callback) {
			callback(this.data);
		},
		set: function(newData) {
			this.data = newData;
		}
	}
};
chrome.storage.local.data['PAGES'] = '[{"description":"Page1","url":"","tests":[{"description":"Test1","code":"","status":"ERROR","isExecuting":false}]}]';

chrome.tabs = {
	create: function(options, callback) {
		callback({id: Math.round(Math.random()*100)});
	},
	executeScript: function(tabId, options, callback) {
		var code = options.code;
		var result = [];
		result[0] = eval(code);
		callback(result);
	},
	remove: function(tabId) {

	}
};