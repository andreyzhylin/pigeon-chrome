var pigeon = (function() {
	var STATUS_UNKNOWN = "UNKNOWN";
	var STATUS_SUCCESS = "SUCCESS";
	var STATUS_FAILED = "FAILED";
	var STATUS_ERROR = "ERROR";

	function PigeonTest(test) {
		this.description = test.description || '';
		this.code = test.code || '';
		this.status = STATUS_UNKNOWN;
		this.isExecuting = false;
		this.page = test.page || null;
	};

	PigeonTest.prototype.execute = function(callback) {
		(function(self) {
			chrome.tabs.create({url:self.page.url, active: false}, function(tab) {
				chrome.tabs.executeScript(tab.id, {code: '('+self.code.toString()+')()'}, function(result) {
					chrome.tabs.remove(tab.id);
					var status;
					if (result[0] === true) {
						self.status = pigeon.STATUS_SUCCESS;
					} else if (result[0] === false) {
						self.status = pigeon.STATUS_FAILED;
					} else {
						self.status = pigeon.STATUS_ERROR;
					}
					callback(self);
				});
			});
		})(this);
	};

	function PigeonPage(page) {
		this.description = page.description || '';
		this.url = page.url || '';
		this.tests = [];
		if (page.tests !== undefined) {
			for (var i = 0; i < page.tests.length; i++) {
				page.tests[i].page = this;
				this.tests.push(new PigeonTest(page.tests[i]));
			}
		}
	};

	PigeonPage.prototype.countTests = function(status) {
		var count = 0;
		for (var i = 0; i < this.tests.length; i++) {
			if (this.tests[i].status === status) {
				count++;
			}
		}
		return count;
	};

	function PigeonStorage() {
		this.pages = [];

		// DEBUG
		this.pages.push(new PigeonPage({
							description: "Habrahabr",
							url: "http://habrahabr.ru",
							tests: [
								{
									description: "Has element #TMpanel",
									code: function() {
										return document.getElementById('TMpanel') != undefined;
									}
								},
								{
									description: "Element #TMpanel length == 899",
									code: function() {
										return document.getElementById('TMpanel').innerHTML.length == 899;
									}
								}
							]
						})
					);
		this.pages.push(new PigeonPage({
							description: "Pikabu",
							url: "http://pikabu.ru",
							tests: [
								{
									description: "Has element #TMpanel",
									code: function() {
										return document.getElementById('TMpanel') != undefined;
									}
								},
								{
									description: "Element #TMpanel length == 899",
									code: function() {
										return document.getElementById('TMpanel').innerHTML.length == 899;
									}
								}
							]
						})
					);

	};

	PigeonStorage.prototype.getPages = function() {
		return this.pages;
	};

	PigeonStorage.prototype.addPage = function(page) {
		this.pages.push( new PigeonPage(page) );
	};

	return {
		STATUS_UNKNOWN: STATUS_UNKNOWN,
		STATUS_SUCCESS: STATUS_SUCCESS,
		STATUS_FAILED: STATUS_FAILED,
		STATUS_ERROR: STATUS_ERROR,
		storage: new PigeonStorage()
	};
})();


