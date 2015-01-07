var pages = [
    {
        description: '0 page',
        url: '0 url',
        tests: [
            {
                description: '0.0 test',
                code: 'pigeon.expect("Always SUCCESS", true); pigeon.resolve();',
                status: 'UNKNOWN',
                isDebug: false
            },
            {
                description: '0.1 test',
                code: 'pigeon.expect("Always FAILED", false); //test \n pigeon.resolve();',
                status: 'UNKNOWN',
                isDebug: false
            },
            {
                description: '0.2 test',
                code: 'pigeon.expect("Always ERROR", 42); pigeon.resolve();',
                status: 'UNKNOWN',
                isDebug: false
            },
            {
                description: '0.3 test',
                code: 'var c = a.b.c; pigeon.resolve();',
                status: 'UNKNOWN',
                isDebug: false
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
                isDebug: false
            }
        ]
    },
    {
        description: 'empty page',
        url: ''
    },
    {
        description: 'Wrong url',
        url: 'qwerty',
        tests: [
            {
                description: '',
                code: 'pigeon.expect("Always SUCCESS", true); pigeon.resolve();',
                status: 'UNKNOWN',
                isDebug: false
            }
        ]
    }
];

var files = [
    {
        name: '0file.js',
        code: 'var myModule = {test: 42, quotesTest: \'test\'};'
    },
    {
        name: '1file.js',
        code: 'var myModule2 = {};'
    }
];

var chrome = {};

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
    codes: [],
    create: function (options, callback) {
        callback({id: Math.round(Math.random() * 1000)});
    },
    executeScript: function (tabId, options, callback) {
        this.codes[tabId] = this.codes[tabId] || '';
        this.codes[tabId] += options.code + ' \n';
        eval(this.codes[tabId]);
        callback();
    },
    remove: function (tabId) {

    }
};

chrome.extension = {
    getViews: function () {
        return [window];
    }
};

chrome.runtime = {
    id: 42,
    sendMessage: function (tabId, message) {
        chrome.runtime.onMessage.listener(message);
    },
    onMessage: {
        listener: undefined,
        addListener: function (callback) {
            chrome.runtime.onMessage.listener = callback;
        }
    }
};
