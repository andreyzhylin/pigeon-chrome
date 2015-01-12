# Pigeon

Detailed description, usage example (russian): [http://andreyzhylin.github.io/pigeon-chrome](http://andreyzhylin.github.io/pigeon-chrome)

## Overview

Sometimes your javascript code should work on few web pages (e.g. browser extension).
This tool allows you to test your code in different page contexts and to be sure that any algoritm changes will not affect on correct execution.
It is a Google Chrome extension so you should download this browser to start work.

## Installation

### From binaries
1. Download [latest release](https://github.com/andreyzhylin/pigeon-chrome/releases/download/v1.1.6/pigeon-chrome-1.1.6.crx).
2. Go to your extensions page - chrome://extensions/ (**Tools > Extensions**).
3. Drag and drop downloaded crx file to extensions page.

### From source code
Install Node.js and then:
```
$ git clone https://github.com/andreyzhylin/pigeon-chrome.git
$ cd pigeon-chrome
$ npm -g install grunt-cli karma bower
$ npm install
$ bower install
$ grunt build
```
Go to your extensions page - chrome://extensions/ (**Tools > Extensions**).
Ensure that the Developer mode checkbox in the top right-hand corner is checked.
Click Load unpacked extension… to pop up a file-selection dialog.
Navigate to '*/pigeon-chrome/build' directory and select it.

## Usage
1. Open an extension options page.
  ![Main page](https://github.com/andreyzhylin/pigeon-chrome/raw/master/common/img/sample-en/sample-0.png)
2. Click on 'Add page' button.
3. Set description and URL of page where your tests should be executed.
  ![Edit page](https://github.com/andreyzhylin/pigeon-chrome/raw/master/common/img/sample-en/sample-1.png)
4. Click on a plus sign in the table to add test.
5. Description will be shown in the table, code will be executed in the context of page you add.
  ![Edit test](https://github.com/andreyzhylin/pigeon-chrome/raw/master/common/img/sample-en/sample-2.png)
  
  Pigeon methods:
  ```javascript
  /**
   * Adds test case to check
   * @param string  message  - will be shown if test case failed
   * @param Boolean testCase - if `false` - test failed, if not Boolean - test error
   */
  pigeon.expect(message, testCase)
  
  /**
   * Finishes test execution
   */
  pigeon.resolve()
  
  /**
   * Finishes test execution with error
   * @param string message - error message
   */
  pigeon.reject(message)
  ```
6. Click on refresh icon in line with created test.

**More:**

- Visit settings page and click 'Install sample set of tests'.
![Sample set of tests](https://github.com/andreyzhylin/pigeon-chrome/raw/master/common/img/sample-en/sample-3.png)
- Explore test codes to go deeper.
- Load external libraries to use in your code (e.g. jQuery) at 'Files' page
