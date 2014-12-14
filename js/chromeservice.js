var chromeService = {

	/**
	 * @description
	 * Opens chrome tab
	 * 
	 * @param  {string} url Page url
	 */
	openPage: function(url, callback) {
		chrome.tabs.create({ url:url, active: false }, function(tab) {
			callback(tab.id);
		});
	},
	/**
	 * @description
	 * Closes chrome tab
	 * 
	 * @param  {number} tabId Tab id
	 */
	closePage: function(tabId) {
		chrome.tabs.remove(tabId);
	},
	/**
	 * @description
	 * Opens chrome tab, executes code, executes callback function
	 *
	 * @param {string} tabId Id of tab where should execute script ( returns by openPage() )
	 * @param {string} code Code to execute
	 * @param {Function} callback Function to execute after executing
	 */
	executeScript: function(tabId, code, callback) {
		chrome.tabs.executeScript(tabId, { code: code }, function(result) {
			callback(result);
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