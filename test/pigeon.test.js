describe("Pigeon execute method", function() {
	beforeEach(function() {
		this.page = {
			description: '',
			url: '',
			tests: [
				{
					description: 'Always success',
					code: 'return true;'
				},
				{
					description: 'Always failed',
					code: 'return false;'
				},
				{
					description: 'Always error',
					code: 'return 42;'
				}
			]
		};
		for (var i = 0; i < this.page.tests.length; i++) {
			this.page.tests[i].page = this.page;
		}
	});

  	it("defined and public", function() {
    	expect(pigeon.execute).toBeDefined();
  	});

  	it("correctly executes without callback function", function() {
  		var test = this.page.tests[0];
  		pigeon.execute(test);
  	});

  	it("correctly set success status", function() {
  		var successTest = this.page.tests[0];
  		pigeon.execute(successTest);
  		expect(successTest.status).toBe(pigeon.statuses.SUCCESS);
  	});

  	it("correctly set failed status", function() {
  		var failedTest = this.page.tests[1];
  		pigeon.execute(failedTest);
  		expect(failedTest.status).toBe(pigeon.statuses.FAILED);
  	});

  	it("correctly set error status", function() {
  		var errorTest = this.page.tests[2];
  		pigeon.execute(errorTest);
  		expect(errorTest.status).toBe(pigeon.statuses.ERROR);
  	});
});

describe("Pigeon storage", function() {
	beforeEach(function() {
		this.pages = pigeon.storage.getPages();
	});

	it("correctly loads data from chrome storage", function() {
		expect(this.pages[0].description).toBe('Page1');
		expect(this.pages[0].tests[0].description).toBe('Test1');
	});

	it("sets to tests link on page which they are belongs", function() {
		expect(this.pages[0].tests[0].page).toBe(this.pages[0]);
	});

	it("correctly gets test by index", function() {
		expect(this.pages[0].tests[0]).toBe(pigeon.storage.getTest(0, 0));
	});

	it("correctly adds test", function() {
		var test = {};
		test.description = 'New test';
		expect(this.pages[0].tests[this.pages[0].tests.length-1].description).not.toBe(test.description);
		pigeon.storage.addTest(test, 0);
		expect(this.pages[0].tests[this.pages[0].tests.length-1].description).toBe(test.description);
	});

	it("correctly edits test", function() {
		var test = {};
		test.description = 'New test';
		test.code = 'New code';
		expect(this.pages[0].tests[0].description).not.toBe(test.description);
		expect(this.pages[0].tests[0].code).not.toBe(test.url);
		pigeon.storage.editTest(test, 0, 0);
		expect(this.pages[0].tests[0].description).toBe(test.description);
		expect(this.pages[0].tests[0].code).toBe(test.code);
	});

	it("correctly removes test", function() {
		var test = this.pages[0].tests[0];
		pigeon.storage.removeTest(test);
		expect(this.pages[0].tests).not.toContain(test);
	});

	it("correctly gets page by index", function() {
		expect(this.pages[0]).toBe(pigeon.storage.getPage(0));
	});

	it("correctly adds page", function() {
		var page = {};
		page.description = 'New page';
		expect(this.pages[this.pages.length-1].description).not.toBe(page.description);
		pigeon.storage.addPage(page);
		expect(this.pages[this.pages.length-1].description).toBe(page.description);
	});

	it("correctly edits page", function() {
		var page = {};
		page.description = 'New description';
		page.url = 'New url';
		expect(this.pages[0].description).not.toBe(page.description);
		expect(this.pages[0].url).not.toBe(page.url);
		pigeon.storage.editPage(page, 0);
		expect(this.pages[0].description).toBe(page.description);
		expect(this.pages[0].url).toBe(page.url);
	});

	it("correctly removes page", function() {
		var page = this.pages[0];
		pigeon.storage.removePage(page);
		expect(this.pages).not.toContain(page);
	});
 
});