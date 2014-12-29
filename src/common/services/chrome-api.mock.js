var pages = [
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
                code: 'return response.length > 100;',
                status: 'UNKNOWN',
                method: 'GET_REQUEST',
                params: [
                    {
                        key: 'q',
                        value: '123'
                    }
                ]
            },
            {
                description: 'POST request test',
                code: 'return response.length < 100;',
                status: 'UNKNOWN',
                method: 'POST_REQUEST',
                params: [
                    {
                        key: 'q',
                        value: '123'
                    }
                ]
            }
        ]
    },
    {
        description: 'Wrong url',
        url: 'qwerty',
        tests: [
            {
                description: '',
                code: 'return true;',
                status: 'UNKNOWN',
                method: 'GET_REQUEST'
            }
        ]
    }
];

var files = [
    {
        name: '0file.js',
        code: 'var myModule = {test: 42};'
    },
    {
        name: '1file.js',
        code: 'var myModule2 = {};'
    }
];

chrome.storage = {
    local: {
        data: {
            PAGES: JSON.stringify(pages),
            FILES: JSON.stringify(files)
        },
        get: function (key, callback) {
            callback(chrome.storage.local.data);
        },
        set: function (newData) {
            for (var key in newData){
                if (newData.hasOwnProperty(key)) {
                     this.data[key] = newData[key];
                }
            }
        }
    }
};

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

    },
};

chrome.extension = {
    getViews: function () {
        return [window];
    }
};
