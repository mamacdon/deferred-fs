# deferred-fs

Provides a promise-based API for Node.js's [filesystem API](http://nodejs.org/api/fs.html).

## Installation

The easiest way is to install deferred-fs using npm, like this:

```
$ npm install deferred-fs
```

This will install deferred-fs into your project's ```node_modules``` subdirectory. From a Node app, you can then load dfs by doing ```require('deferred-fs')```.

## Deferred-fs API

The object returned by ```require('deferred-fs')``` works exactly like Node's ```fs``` library, except that its asynchronous methods return a 
promise object instead of accepting a callback argument.

Here's an example showing how to use ```writeFile``` to asynchronously write a file and print a completion message when done:

```js
var dfs = require('dfs');
dfs.writeFile('hello.txt', 'Hello world!', 'utf8').then(
    function () {
        console.log('File was written successfully.');
    });
```

In cases where a normal callback would return an "error" argument, the returned promise *rejects*, meaning the second callback is invoked:

```js
var dfs = require('dfs');
dfs.readFile('/file_that_does_not_exist').then(
	null,
    function (error) {
        console.log('Yikes, an error occurred! ' + error);
    });
```

The above program will output:

```
Yikes, an error occurred! Error: ENOENT, open 'c:\file_that_does_not_exist'
```

The real advantage of the promise approach comes from chaining promises together, allowing you to transform values returned by earlier callbacks
and implement high-level error handling.

## Promise API
The promise object returned by deferred-fs's asynchronous methods has the familiar "then" API:

* ```then(onResolve, onReject)```

Internally these promises are implemented using the Deferred library from [Eclipse Orion](http://eclipse.org/orion). This means they're 100% 
compliant with the [Promises/A+ specification](https://github.com/promises-aplus/promises-spec).

## Deferred API
deferred-fs also exports Orion's Deferred library, giving you access to a richer API than simple promises:

```js
var Deferred = require('deferred-fs').Deferred;

var promises = [ new Deferred().resolve('resolved!'), new Deferred().reject('rejected :(') ];
Deferred.all(promises).then(
  function(results) {
    console.log('All promises resolved: ' + results.join(', '));
  }, function(err) {
    console.log('An error occurred: ' + err);
  });
```

Consult the [Deferred JSDoc](https://orionhub.org/jsdoc/symbols/orion.Deferred.html) for details of the available API methods. In addition to Promises/A+ compliance,
Orion's Deferred also implements some evolving APIs like [progress](https://github.com/promises-aplus/progress-spec) and 
[cancellation](https://github.com/promises-aplus/cancellation-spec).
