function Pigeon(tests, executeCallback) {
	this.STATUS_SUCCESS = "SUCCESS";
	this.STATUS_FAILED = "FAILED";
	this.STATUS_ERROR = "ERROR";
	
	this.tests = tests;
	for (var i in tests) {
		for (var j in tests[i].cases) {
			tests[i].cases[j].status = this.STATUS_UNKNOWN;
		}
	}

	this.callback = executeCallback;

	this.execute = function(testNum, caseNum) {
		(function (pigeon) {
			chrome.tabs.create({url:pigeon.tests[testNum].url, active: false}, function(tab) {
				chrome.tabs.executeScript(tab.id, {code: '('+pigeon.tests[testNum].cases[caseNum].code.toString()+')()'}, function(result) {
					pigeon.tests[testNum].cases[caseNum].result = result[0];
					chrome.tabs.remove(tab.id);
					var status;
					if (result[0] === true) {
						status = pigeon.STATUS_SUCCESS;
					} else if (result[0] === false) {
						status = pigeon.STATUS_FAILED;
					} else {
						status = pigeon.STATUS_ERROR;
					}
					pigeon.callback(testNum, caseNum, status);
				});
			});
		})(this);
	}
}