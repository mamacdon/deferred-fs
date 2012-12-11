/*global exports module require*/
/*jslint laxbreak:true*/
var fs = require('fs');
var Deferred = require('./orion-deferred/Deferred');

/**
 * Typical fulfill function for most fs methods. The typical convention for callback arguments is:
 *   arguments[0]: optional error
 *   arguments[1]: optional value
 */
function fulfill(deferred, error, value) {
	if (error) {
		deferred.reject(error);
	} else {
		deferred.resolve(value);
	}
}

/**
 * @param {Object} host
 * @param {Function} asyncMethod The async method to promise-ify
 * @param {Function} [fulfillFunc] Acts as the callback for the async method. Invoked as 
 * fulfillFunc(deferred, ...rest) where <code>rest</code> are the arguments passed to the
 * callback. The fulfillFunc must resolve or reject the deferred given in its first argument.
 */
function promiseify(host, asyncMethod, fulfillFunc) {
	fulfillFunc = fulfillFunc || fulfill;
	return function() {
		var deferred = new Deferred();
		// Throw away the callback if one was passed
		var args = typeof arguments[arguments.length - 1] === 'function' 
			? Array.prototype.slice.call(arguments, 0, arguments.length - 1)
			: Array.prototype.slice.call(arguments);
		args.push(fulfillFunc.bind(null, deferred));
		asyncMethod.apply(host, args);
		return deferred;
	};
}

var dfs = {};
Object.keys(fs).forEach(function(name) {
	if (typeof fs[name] === 'function' && fs[name + 'Sync']) {
		if (name === 'exists') {
			// Special case: fs.exists calls back with only a single argument.
			dfs.exists = promiseify(fs, fs.exists, function(deferred, exists) {
				deferred.resolve(exists);
			});
		} else {
			dfs[name] = promiseify(fs, fs[name]);
		}
	} else {
		dfs[name] = fs[name];
	}
});

module.exports = dfs;