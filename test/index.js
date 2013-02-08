/*global Buffer console process require describe it beforeEach*/
var assert = require('assert');
var fs = require('fs');
var os = require('os');
var path = require('path');
var Deferred = require('../lib/orion-deferred/Deferred');
var DFS = '../index.js';

describe('deferred-fs', function() {
	var dfs;

	beforeEach(function() {
		dfs = require(DFS);
	});
	it('can be require()d ok', function() {
		require(DFS);
	});
	it('#Deferred exported', function() {
		var exported = require(DFS).Deferred;
		assert.ok(exported);
		assert.equal(exported, Deferred);
	});
	it('#exists()', function(done) {
		dfs.exists('.').then(function(exists) {
			if (exists) {
				done();
			} else {
				throw new Error('Expected "." to exist');
			}
		}, done);
	});
	it('#readFile()', function(done) {
		var file = path.join(os.tmpDir(), 'tempRead.txt'), tempData = 'read';
		fs.writeFile(file, tempData, function(err) {
			if (err) { done(err); }
			dfs.readFile(file).then(function(data) {
				try {
					assert.equal(Buffer.isBuffer(data), true, 'Should get a buffer');
					assert.equal(data.toString(), tempData, 'Correct data was read');
					done();
				} catch (e) {
					done(e);
				}
			}, done); 
		});
	});
	it('#readFile() with encoding', function(done) {
		var file = path.join(os.tmpDir(), 'tempRead.txt'), tempData = 'read';
		fs.writeFile(file, tempData, function(err) {
			if (err) { done(err); }
			dfs.readFile(file, 'utf8').then(function(data) {
				try {
					assert.equal('string', typeof data);
					assert.equal(false, Buffer.isBuffer(data));
					assert.equal(data.toString(), tempData, 'Correct data was read');
					done();
				} catch (e) {
					done(e);
				}
			}, done);
		});
	});
	it('#writeFile()', function(done) {
		var file = path.join(os.tmpDir(), 'tempWrite.txt'), tempData = 'write';
		dfs.writeFile(file, tempData).then(function() {
			fs.readFile(file, function(err, data) {
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
