var data = [
	{
		description: '0 page',
		url: '0 url',
		tests: [
			{
				description: '0.0 test',
				code: 'return true;',
				status: 'SUCCESS'
			},
			{
				description: '0.1 test',
				code: 'return false;',
				status: 'FAILED'
			},
			{
				description: '0.2 test',
				code: 'return 42;',
				status: 'ERROR'
			},
			{
				description: '0.3 test',
				code: '0.3 code',
				status: 'ERROR'
			}
		]
	},
	{
		description: '1 page',
		url: '1 url',
		tests: [
			{
				description: '1.0 test',
				code: '1.0 code',
				status: 'UNKNOWN'
			}
		]		
	}
]

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
chrome.storage.local.data['PAGES'] = JSON.stringify(data);

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