var chromeService = {
	/**
	 * @description
	 * Opens chrome tab, executes code, executes callback function
	 *
	 * @param {string} test Test to execute
	 * @param {string} code Code to execute
	 * @param {Function} callback Function to execute after executing
	 */
	executeScript: function(url, code, callback) {
		chrome.tabs.create({ url:url, active: false }, function(tab) {
			chrome.tabs.executeScript(tab.id, { code: code }, function(result) {
				chrome.tabs.remove(tab.id);
				callback(result);
			});
		});
	},

	/**
	 * @description
	 * Saves data to chrome storage
	 * 
	 * @param  {object} data Data to store
	 */
	saveData: function(data) {
		chrome.storage.local.set(data);
	},

	/**
	 * @description
	 * Loads data from chrome storage
	 * 
	 * @param  {string} key Key of searched 
	 * @param  {function} callback Callback function
	 */
	loadData: function(key, callback) {
		chrome.storage.local.get(key, function(data) {
			callback(data);
		});
	}
};