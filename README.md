# deferred-fs
Provides a promise-based API for Node.js's filesystem API.

## Deferred API
[Full JSDoc available here](https://orionhub.org/jsdoc/symbols/orion.Deferred.html).

### Instance methods
* cancel(reason, strict)
* isCanceled()
* isFulfilled()
* isRejected()
* isResolved()
* progress(update, strict)
* reject(error, strict)
* resolve(value, strict)
* then(onResolve, onReject, onProgress)

### Fields
* promise

### Static methods
* Deferred.when(value, onResolve, onReject, onProgress)
* Deferred.all
