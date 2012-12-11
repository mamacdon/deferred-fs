/*global console process require*/
var assert = require('assert');
var fs = require('fs');
var os = require('os');
var path = require('path');
var Deferred = require('../lib/orion-deferred/Deferred');
var DFS = '../lib/dfs';

var tests = {};
tests.test_load_module = function() {
	require(DFS);
};
tests.test_dfs_exists = function() {
	var dfs = require(DFS);
	var d = new Deferred();
	dfs.exists('.').then(function(exists) {
		if (exists) {
			d.resolve();
		} else {
			d.reject('. should exist');
		}
	}, function(error) {
		d.reject(error);
	});
	return d;
};
tests.test_dfsReadFile = function() {
	var dfs = require(DFS);
	var d = new Deferred();
	var temp = path.join(os.tmpDir(), 'tempRead.txt'), tempData = 'read';
	fs.writeFile(temp, tempData, function(err) {
		if (err) { d.reject(err); }
		dfs.readFile(temp).then(function(data) {
			if (data.toString() !== tempData) { d.reject('Expected "' + tempData + '" found "' + data + '"'); }
			d.resolve();
		}, d.reject);
	});
	return d;
};
tests.test_dfs_writeFile = function() {
	var dfs = require(DFS);
	var d = new Deferred();
	var temp = path.join(os.tmpDir(), 'tempWrite.txt'), tempData = 'write';
	dfs.writeFile(temp, tempData).then(function() {
		fs.readFile(temp, function(err, data) {
			if (err) { d.reject(err); }
			if (data.toString() !== tempData) { d.reject('Expected foo, found ' + data); }
			d.resolve();
		});
		d.resolve();
	}, d.reject);
	return d;
};

// TODO run the promise tester

// TODO Get a real test harness
try {
	var successes = [], failures = [];
	var pendingAsyncTests = [];
	Object.keys(tests).forEach(function(testName) {
		var success = function(value) {
			successes.push({test: testName, value: value});
		};
		var failure = function(error) {
			failures.push({test: testName, error: error});
		};
		var test = tests[testName];
		try {
			var result = test();
			if (result && typeof result.then === 'function') {
				pendingAsyncTests.push(result.then(success, failure));
			} else {
				successes.push({test: testName, value: result});
				pendingAsyncTests.push(new Deferred().resolve(result));
			}
		} catch (error) {
			failures.push({test: testName, error: error});
			pendingAsyncTests.push(new Deferred().reject(error));
		}
	});
	var done = function() {
		var numPassed = successes.length, numFailed = failures.length;
		if (numFailed) {
			console.log(
				failures.map(function(failure) {
					return failure.test + ': ' + failure.error;
				}).join('\n'));
		}
		console.log('Passed: ' + numPassed);
		console.log('Failed: ' + numFailed);
		console.log('PASS RATE: ' + (numPassed/(numPassed + numFailed)*100.0));
		process.exit(numFailed);
	};
	return Deferred.all(pendingAsyncTests).then(done, done);
} catch (error) {
	console.log(error && error.stack);
	process.exit(1);
}