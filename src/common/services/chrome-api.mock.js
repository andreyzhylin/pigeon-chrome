var data = [
    {
        description: '0 page',
        url: '0 url',
        tests: [
            {
                description: '0.0 test',
                code: 'return true;',
                status: 'SUCCESS',
                method: 'OPEN_TAB'
            },
            {
                description: '0.1 test',
                code: 'return false;',
                status: 'FAILED',
                method: 'OPEN_TAB'
            },
            {
                description: '0.2 test',
                code: 'return 42;',
                status: 'ERROR',
                method: 'OPEN_TAB'
            },
            {
                description: '0.3 test',
                code: 'return "SUCCESS";',
                status: 'ERROR',
                method: 'OPEN_TAB'
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
                status: 'ERROR',
                method: 'OPEN_TAB'
            }
        ]
    },
    {
        description: 'empty page',
        url: ''
    },
    {
        description: 'Different methods',
        url: 'http://google.com',
        tests: [
            {
                description: 'Tab open test',
                code: 'return 42;',
                status: 'UNKNOWN',
                method: 'OPEN_TAB'
            },
            {
                description: 'GET request test',
                code: 'response.length > 100;',
                status: 'UNKNOWN',
                method: 'GET_REQUEST'
            },
            {
                description: 'POST request test',
                code: 'response.length < 100;',
                status: 'UNKNOWN',
                method: 'POST_REQUEST'
            }
        ]
    }
];

chrome.storage = {
    local: {
        data: [],
        get: function (key, callback) {
            callback(this.data);
        },
        set: function (newData) {
            this.data = newData;
        }
    }
};
chrome.storage.local.data.PAGES = JSON.stringify(data);

chrome.tabs = {
    create: function (options, callback) {
        callback({id: 42});
    },
    executeScript: function (tabId, options, callback) {
        var code = options.code;
        var result = [];
        result[0] = eval(code);
        callback(result);
    },
    remove: function (tabId) {

    }
};
