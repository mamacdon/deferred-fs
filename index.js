/*global module require*/
var dfs = require('./lib/dfs');
module.exports = dfs;
module.exports.Deferred = require('./lib/orion-deferred/Deferred');