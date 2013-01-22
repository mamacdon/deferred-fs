/*global console process require describe it beforeEach*/
var assert = require('assert');
var fs = require('fs');
var os = require('os');
var path = require('path');
var mocha = require('mocha');
var Deferred = require('../lib/orion-deferred/Deferred');
var DFS = '../index.js';

describe('dfs', function() {
	var dfs;

	beforeEach(function() {
		dfs = require(DFS);
	});
	it('can be require()d ok', function() {
		require(DFS);
	});
	it('exports Deferred', function() {
		var exported = require(DFS).Deferred;
		assert.ok(exported);
		assert.equal(exported, Deferred);
	});
	it('works with #exists()', function(done) {
		dfs.exists('.').then(function(exists) {
			if (exists) {
				done();
			} else {
				throw new Error('Expected "." to exist');
			}
		}, done);
	});
	it('works with #readFile()', function(done) {
		var temp = path.join(os.tmpDir(), 'tempRead.txt'), tempData = 'read';
		fs.writeFile(temp, tempData, function(err) {
			if (err) { done(err); }
			dfs.readFile(temp).then(function(data) {
				try {
					assert.equal(data.toString(), tempData, 'Correct data was read');
					done();
				} catch (e) {
					done(e);
				}
			}, done); 
		});
	});
	it('works with #writeFile()', function(done) {
		var temp = path.join(os.tmpDir(), 'tempWrite.txt'), tempData = 'write';
		dfs.writeFile(temp, tempData).then(function() {
			fs.readFile(temp, function(err, data) {
				if (err) { done(err); }
				try {
					assert.equal(data.toString(), tempData, 'Correct data was written');
					done();
				} catch (e) {
					done(e);
				}
			});
		}, done);
	});
});
