'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _isEmpty = _interopDefault(require('lodash/isEmpty'));
var _get$1 = _interopDefault(require('lodash/get'));
var _hasIn = _interopDefault(require('lodash/hasIn'));
var axios = _interopDefault(require('axios'));
var Qs = _interopDefault(require('qs'));
var _extend = _interopDefault(require('lodash/extend'));
var _isString = _interopDefault(require('lodash/isString'));
var _isBoolean = _interopDefault(require('lodash/isBoolean'));
var _isObject = _interopDefault(require('lodash/isObject'));
var _isNaN = _interopDefault(require('lodash/isNaN'));
var _isNil = _interopDefault(require('lodash/isNil'));
var _cloneDeep = _interopDefault(require('lodash/cloneDeep'));
var redux = require('redux');
var reactRedux = require('react-redux');
var thunk = _interopDefault(require('redux-thunk'));
var _pick = _interopDefault(require('lodash/pick'));
var React = require('react');
var React__default = _interopDefault(React);
var semanticUiReact = require('semantic-ui-react');
var _ = _interopDefault(require('lodash'));

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var ESRequestSerializer = function ESRequestSerializer() {
  _classCallCheck(this, ESRequestSerializer);

  this.serialize = function (stateQuery) {
    var queryString = stateQuery.queryString,
        sortBy = stateQuery.sortBy,
        sortOrder = stateQuery.sortOrder,
        page = stateQuery.page,
        size = stateQuery.size;
    var bodyParams = {};

    if (!_isEmpty(queryString)) {
      bodyParams['query'] = {
        query_string: {
          query: queryString
        }
      };
    }

    if (sortBy) {
      var sortObj = {};
      sortObj[sortBy] = sortOrder && sortOrder === 'desc' ? 'desc' : 'asc';
      bodyParams['sort'] = sortObj;
    }

    if (size > 0) {
      bodyParams['size'] = size;
    }

    if (page > 0) {
      var s = size > 0 ? size : 0;
      var from = (page - 1) * s;
      bodyParams['from'] = from;
    }

    return bodyParams;
  };
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2019 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */
var ESResponseSerializer = function ESResponseSerializer() {
  _classCallCheck(this, ESResponseSerializer);

  this.serialize = function (payload) {
    return {
      aggregations: payload.aggregations || {},
      hits: payload.hits.hits.map(function (hit) {
        return hit._source;
      }),
      total: payload.hits.total.value
    };
  };
};

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
});

var regenerator = runtime_1;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var ESSearchApi =
/*#__PURE__*/
function () {
  function ESSearchApi(config) {
    var _this = this;

    _classCallCheck(this, ESSearchApi);

    this.search =
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee(stateQuery) {
        var payload, response;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                payload = _this.requestSerializer.serialize(stateQuery);
                _context.next = 3;
                return _this.http.request({
                  method: 'POST',
                  data: payload
                });

              case 3:
                response = _context.sent;
                return _context.abrupt("return", _this.responseSerializer.serialize(response.data));

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();

    this.validateConfig(config);
    this.initSerializers(config);
    this.initAxios(config);
  }

  _createClass(ESSearchApi, [{
    key: "validateConfig",
    value: function validateConfig(config) {
      if (!_hasIn(config, 'url')) {
        throw new Error('ESSearchApi config: `node` field is required.');
      }
    }
  }, {
    key: "initSerializers",
    value: function initSerializers(config) {
      var requestSerializerCls = _get$1(config, 'es.requestSerializer', ESRequestSerializer);

      var responseSerializerCls = _get$1(config, 'es.responseSerializer', ESResponseSerializer);

      this.requestSerializer = new requestSerializerCls();
      this.responseSerializer = new responseSerializerCls();
    }
  }, {
    key: "initAxios",
    value: function initAxios(config) {
      delete config.es;

      var axiosConfig = _objectSpread2({
        baseURL: config.url
      }, config);

      this.http = axios.create(axiosConfig);
    }
    /**
     * Perform the backend request to search and return the serialized list of results for the app state `results`.
     * @param {string} stateQuery the `query` state with the user input
     */

  }]);

  return ESSearchApi;
}();

/** Default backend request serializer */

var InvenioRequestSerializer = function InvenioRequestSerializer() {
  var _this = this;

  _classCallCheck(this, InvenioRequestSerializer);

  this._addFilter = function (filter, filterUrlParams) {
    if (!Array.isArray(filter)) {
      throw new Error("Filter value \"".concat(filter, "\" in query state must be an array."));
    }

    if (!(filter.length === 2 || filter.length === 3)) {
      throw new Error("Filter value \"".concat(filter, "\" in query state must be an array of 2 or 3 elements"));
    }

    var aggName = filter[0];
    var fieldValue = filter[1];
    filterUrlParams[aggName] = fieldValue;
    var hasChild = filter.length === 3;

    if (hasChild) {
      _this._addFilter(filter[2], filterUrlParams);
    }
  };

  this._addFilters = function (filters) {
    if (!Array.isArray(filters)) {
      throw new Error("Filters query state \"".concat(filters, "\" must be an array."));
    }
    /**
     * input: [
     *   [ 'type_agg', 'value1' ]
     *   [ 'type_agg', 'value2', [ 'subtype_agg', 'a value' ] ]
     * ]
     */


    var filterUrlParams = {};
    filters.forEach(function (filter) {
      _this._addFilter(filter, filterUrlParams);
    });
    /**
     * output: {
     *  type_agg: 'value1'.
     *  subtype_agg: 'a value'
     * }
     */

    return filterUrlParams;
  };

  this.serialize = function (stateQuery) {
    var queryString = stateQuery.queryString,
        sortBy = stateQuery.sortBy,
        sortOrder = stateQuery.sortOrder,
        page = stateQuery.page,
        size = stateQuery.size,
        filters = stateQuery.filters;
    var getParams = {};

    if (queryString !== null) {
      getParams['q'] = queryString;
    }

    if (sortBy !== null) {
      getParams['sort'] = sortBy;

      if (sortOrder !== null) {
        getParams['sort'] = sortOrder === 'desc' ? "-".concat(sortBy) : sortBy;
      }
    }

    if (page > 0) {
      getParams['page'] = page;
    }

    if (size > 0) {
      getParams['size'] = size;
    }

    var filterParams = _this._addFilters(filters);

    _extend(getParams, filterParams);

    return Qs.stringify(getParams, {
      arrayFormat: 'repeat'
    });
  };
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2019 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/** Default backend response serializer */
var InvenioResponseSerializer = function InvenioResponseSerializer() {
  _classCallCheck(this, InvenioResponseSerializer);

  this.serialize = function (payload) {
    return {
      aggregations: payload.aggregations || {},
      hits: payload.hits.hits,
      total: payload.hits.total
    };
  };
};

var InvenioSearchApi =
/*#__PURE__*/
function () {
  function InvenioSearchApi(config) {
    var _this = this;

    _classCallCheck(this, InvenioSearchApi);

    this.search =
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee(stateQuery) {
        var response;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.http.request({
                  params: stateQuery
                });

              case 2:
                response = _context.sent;
                return _context.abrupt("return", _this.responseSerializer.serialize(response.data));

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();

    this.validateConfig(config);
    this.initSerializers(config);
    this.initAxios(config);
  }

  _createClass(InvenioSearchApi, [{
    key: "validateConfig",
    value: function validateConfig(config) {
      if (!_hasIn(config, 'url')) {
        throw new Error('InvenioSearchApi config: `url` field is required.');
      }
    }
  }, {
    key: "initSerializers",
    value: function initSerializers(config) {
      var requestSerializerCls = _get$1(config, 'invenio.requestSerializer', InvenioRequestSerializer);

      var responseSerializerCls = _get$1(config, 'invenio.responseSerializer', InvenioResponseSerializer);

      this.requestSerializer = new requestSerializerCls();
      this.responseSerializer = new responseSerializerCls();
    }
  }, {
    key: "initAxios",
    value: function initAxios(config) {
      delete config.invenio;

      var axiosConfig = _objectSpread2({
        paramsSerializer: this.requestSerializer.serialize,
        baseURL: config.url
      }, config);

      this.http = axios.create(axiosConfig);

      if (config.interceptors) {
        this.addInterceptors(config.interceptors);
      }
    }
  }, {
    key: "addInterceptors",
    value: function addInterceptors(interceptors) {
      if (interceptors.request) {
        this.http.interceptors.request.use(interceptors.request.resolve, interceptors.request.reject);
      }

      if (interceptors.response) {
        this.http.interceptors.response.use(interceptors.response.resolve, interceptors.response.reject);
      }
    }
    /**
     * Perform the backend request to search and return the serialized list of results for the app state `results`.
     * @param {string} stateQuery the `query` state with the user input
     */

  }]);

  return InvenioSearchApi;
}();

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

var InvenioSuggestionRequestSerializer = function InvenioSuggestionRequestSerializer(queryField) {
  var _this = this;

  _classCallCheck(this, InvenioSuggestionRequestSerializer);

  this.serialize = function (stateQuery) {
    var suggestionString = stateQuery.suggestionString;
    var getParams = {};

    if (suggestionString !== null) {
      getParams['q'] = _this.queryField + ':' + suggestionString;
    }

    return Qs.stringify(getParams, {
      arrayFormat: 'repeat',
      encode: false
    });
  };

  this.queryField = queryField;
}
/**
 * Return a serialized version of the app state `query` for the API backend.
 * @param {object} stateQuery the `query` state to serialize
 */
;

var InvenioSuggestionResponseSerializer = function InvenioSuggestionResponseSerializer(responseField) {
  var _this2 = this;

  _classCallCheck(this, InvenioSuggestionResponseSerializer);

  this._serializeSuggestions = function (responseHits) {
    return Array.from(new Set(responseHits.map(function (hit) {
      return _get$1(hit.metadata, _this2.responseFieldPath);
    })));
  };

  this.serialize = function (payload) {
    return {
      suggestions: _this2._serializeSuggestions(payload.hits.hits || [])
    };
  };

  this.responseFieldPath = responseField.split('.');
};

var InvenioSuggestionApi =
/*#__PURE__*/
function (_InvenioSearchApi) {
  _inherits(InvenioSuggestionApi, _InvenioSearchApi);

  function InvenioSuggestionApi() {
    _classCallCheck(this, InvenioSuggestionApi);

    return _possibleConstructorReturn(this, _getPrototypeOf(InvenioSuggestionApi).apply(this, arguments));
  }

  _createClass(InvenioSuggestionApi, [{
    key: "validateConfig",
    value: function validateConfig(config) {
      _get(_getPrototypeOf(InvenioSuggestionApi.prototype), "validateConfig", this).call(this, config);

      if (!_hasIn(config, 'invenio.suggestions.queryField')) {
        throw new Error('InvenioSuggestionApi config: `invenio.suggestions.queryField` is required.');
      }

      if (!_hasIn(config, 'invenio.suggestions.responseField')) {
        throw new Error('InvenioSuggestionApi config: `invenio.suggestions.queryField` is responseField.');
      }
    }
  }, {
    key: "initSerializers",
    value: function initSerializers(config) {
      var requestSerializerCls = _get$1(config, 'invenio.requestSerializer', InvenioSuggestionRequestSerializer);

      var responseSerializerCls = _get$1(config, 'invenio.responseSerializer', InvenioSuggestionResponseSerializer);

      this.requestSerializer = new requestSerializerCls(config.invenio.suggestions.queryField);
      this.responseSerializer = new responseSerializerCls(config.invenio.suggestions.responseField);
    }
  }]);

  return InvenioSuggestionApi;
}(InvenioSearchApi);

var pushHistory = function pushHistory(query) {
  if (window.history.pushState) {
    window.history.pushState({
      path: query
    }, '', query);
  }
};

var replaceHistory = function replaceHistory(query) {
  if (window.history.replaceState) {
    window.history.replaceState({
      path: query
    }, '', query);
  }
};
/** Default URL parser implementation */


var UrlParser = function UrlParser() {
  var _this = this;

  _classCallCheck(this, UrlParser);

  this._sanitizeParamValue = function (value) {
    var parsedValue = parseInt(value);

    if (_isNaN(parsedValue)) {
      try {
        var _value = JSON.parse(value);

        if (!_isNil(_value)) {
          parsedValue = _value;
        }
      } catch (e) {
        if (value !== 'undefined') {
          parsedValue = value;
        } else {
          console.error("Cannot parse value ".concat(value, "."));
        }
      }
    }

    return parsedValue;
  };

  this.parse = function () {
    var queryString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var parsedParams = Qs.parse(queryString, {
      ignoreQueryPrefix: true
    });
    var params = {};
    Object.entries(parsedParams).forEach(function (entry) {
      var key = entry[0];
      var value = entry[1];
      params[key] = _this._sanitizeParamValue(value);
    });
    return params;
  };
};
/** Default implementation for a param validator class */


var UrlParamValidator = function UrlParamValidator() {
  _classCallCheck(this, UrlParamValidator);

  this.isValid = function (key, value) {
    return true;
  };
};
/** Object responsible to update the URL query string and parse it to update the app state */


var UrlHandlerApi = function UrlHandlerApi() {
  var _this2 = this;

  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, UrlHandlerApi);

  this._filterListToString = function (filter) {
    var childFilter = filter.length === 3 ? _this2.urlFilterSeparator.concat(_this2._filterListToString(filter[2])) : '';
    return "".concat(filter[0], ":").concat(filter[1]).concat(childFilter);
  };

  this._mapQueryStateToUrlParams = function (queryState) {
    var params = {};
    Object.keys(queryState).filter(function (stateKey) {
      return stateKey in _this2.urlParamsMapping;
    }).filter(function (stateKey) {
      // filter out negative or null values
      if ((stateKey === 'page' || stateKey === 'size') && queryState[stateKey] <= 0) {
        return false;
      }

      return queryState[stateKey] !== null;
    }).forEach(function (stateKey) {
      var paramKey = _this2.urlParamsMapping[stateKey];

      if (stateKey === 'filters') {
        params[paramKey] = queryState[stateKey].map(function (filter) {
          return _this2._filterListToString(filter);
        });
      } else {
        params[paramKey] = queryState[stateKey];
      }
    }); // will omit undefined and null values from the query

    return Qs.stringify(params, {
      addQueryPrefix: true,
      skipNulls: true,
      indices: false // order for filters params is not important, remove indices

    });
  };

  this._filterStringToList = function (filterStr) {
    var childSepPos = filterStr.indexOf(_this2.urlFilterSeparator);
    var hasChild = childSepPos > -1;
    var aggNamePos = filterStr.indexOf(':');

    if (aggNamePos === -1) {
      throw new Error("Filter \"".concat(filterStr, "\" not parsable. Format expected: \"<agg name>:<value>\""));
    }

    var aggName = filterStr.slice(0, aggNamePos);
    var end = hasChild ? childSepPos : filterStr.length;
    var value = filterStr.slice(aggNamePos + 1, end);
    var filterList = [aggName, value];

    if (hasChild) {
      var childFilter = filterStr.slice(childSepPos + 1, filterStr.length);
      filterList.push(_this2._filterStringToList(childFilter));
    }

    return filterList;
  };

  this._mapUrlParamsToQueryState = function (urlParamsObj) {
    var result = {};
    Object.keys(urlParamsObj).forEach(function (paramKey) {
      if (_this2.urlParamValidator.isValid(paramKey, urlParamsObj[paramKey])) {
        var queryStateKey = _this2.fromUrlParamsMapping[paramKey];
        result[queryStateKey] = urlParamsObj[paramKey]; // custom transformation for filters

        if (queryStateKey === 'filters') {
          if (!Array.isArray(urlParamsObj[paramKey])) {
            // if only 1 filter, create an array with one element
            urlParamsObj[paramKey] = [urlParamsObj[paramKey]];
          }

          result[queryStateKey] = urlParamsObj[paramKey].map(function (filter) {
            return _this2._filterStringToList(filter);
          });
        }
      }
    });
    return result;
  };

  this._mergeParamsIntoState = function (urlStateObj, queryState) {
    var _queryState = _cloneDeep(queryState);

    Object.keys(urlStateObj).forEach(function (stateKey) {
      if (stateKey in _queryState) {
        _queryState[stateKey] = urlStateObj[stateKey];
      }
    });
    return _queryState;
  };

  this.get = function (queryState) {
    var urlParamsObj = _this2.urlParser.parse(window.location.search);

    var urlStateObj = _this2._mapUrlParamsToQueryState(urlParamsObj);

    var newQueryState = _this2._mergeParamsIntoState(urlStateObj, queryState);

    var newUrlParams = _this2._mapQueryStateToUrlParams(newQueryState);

    replaceHistory(newUrlParams);
    return newQueryState;
  };

  this.set = function (stateQuery) {
    if (_this2.keepHistory) {
      var newUrlParams = _this2._mapQueryStateToUrlParams(stateQuery);

      pushHistory(newUrlParams);
    } else {
      _this2.replace(stateQuery);
    }
  };

  this.replace = function (stateQuery) {
    var newUrlParams = _this2._mapQueryStateToUrlParams(stateQuery);

    replaceHistory(newUrlParams);
  };

  this.urlParamsMapping = _isObject(config.urlParamsMapping) ? config.urlParamsMapping : {
    queryString: 'q',
    sortBy: 'sort',
    sortOrder: 'order',
    page: 'p',
    size: 's',
    layout: 'l',
    filters: 'f'
  };
  this.keepHistory = config.keepHistory !== undefined ? config.keepHistory : true;

  if (!_isBoolean(this.keepHistory)) {
    throw new Error("\"keepHistory configuration must be a boolean, ".concat(this.keepHistory, " provided."));
  }

  this.urlFilterSeparator = config.urlFilterSeparator !== undefined ? config.urlFilterSeparator : '+';

  if (!_isString(this.urlFilterSeparator)) {
    throw new Error("\"urlFilterSeparator configuration must be a string, ".concat(this.urlFilterSeparator, " provided."));
  }

  this.urlParamValidator = config.urlParamValidator || new UrlParamValidator();
  this.urlParser = config.urlParser || new UrlParser(); // build the serializer from URL params to Query state by flipping the urlParamsMapping

  this.fromUrlParamsMapping = {};
  Object.keys(this.urlParamsMapping).forEach(function (stateKey) {
    _this2.fromUrlParamsMapping[_this2.urlParamsMapping[stateKey]] = stateKey;
  });
}
/**
 * Map filters from list to string that is human readable
 * [ 'type', 'photo', [ 'subtype', 'png' ]] => type:photo+subtype:png
 */
;

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */
var SET_QUERY_COMPONENT_INITIAL_STATE = 'SET_QUERY_COMPONENT_INITIAL_STATE';
var SET_QUERY_STATE_URL_EXTERNALLY_CHANGED = 'SET_QUERY_STATE_URL_EXTERNALLY_CHANGED';
var SET_QUERY_STRING = 'SET_QUERY_STRING';
var SET_QUERY_SORTING = 'SET_QUERY_SORTING';
var SET_QUERY_SORT_BY = 'SET_QUERY_SORT_BY';
var SET_QUERY_SORT_ORDER = 'SET_QUERY_SORT_ORDER';
var SET_QUERY_STATE = 'SET_QUERY_STATE';
var SET_QUERY_PAGINATION_PAGE = 'SET_QUERY_PAGINATION_PAGE';
var SET_QUERY_PAGINATION_SIZE = 'SET_QUERY_PAGINATION_SIZE';
var SET_QUERY_FILTERS = 'SET_QUERY_FILTERS';
var SET_QUERY_SUGGESTIONS = 'SET_QUERY_SUGGESTIONS';
var SET_SUGGESTION_STRING = 'SET_SUGGESTION_STRING';
var CLEAR_QUERY_SUGGESTIONS = 'CLEAR_QUERY_SUGGESTIONS';
var RESULTS_LOADING = 'RESULTS_LOADING';
var RESULTS_FETCH_SUCCESS = 'RESULTS_FETCH_SUCCESS';
var RESULTS_FETCH_ERROR = 'RESULTS_FETCH_ERROR';
var RESULTS_UPDATE_LAYOUT = 'RESULTS_UPDATE_LAYOUT';
var RESET_QUERY = 'RESET_QUERY';

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018-2019 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */
/**
 * Return true if the first string starts and contains the second.
 * @param {string} first a string
 * @param {string} second a string
 */

function startsWith(first, second) {
  return first.indexOf(second) === 0;
}

function toString(array) {
  return Qs.stringify({
    q: array
  });
}

function parse(str) {
  return Qs.parse(str)['q'];
}

function removeLastChild(arr) {
  var hasChild = arr.length === 3;

  if (hasChild) {
    var result = [arr[0], arr[1]];
    var lastChild = removeLastChild(arr[2]);

    if (lastChild.length) {
      result.push(lastChild);
    }

    return result;
  }

  return [];
}

var updateQueryFilters = function updateQueryFilters(queryFilter, stateFilters) {
  if (_isEmpty(queryFilter)) return;
  /**
   * convert query and state to strings so they can be compared
   */

  var strQuery = toString(queryFilter);
  var strStateFilters = stateFilters.map(function (stateObjQuery) {
    return toString(stateObjQuery);
  });
  /**
   * filter out any state that starts with the query or any parent of the query
   * e.g. query = ['file_type', 'pdf']
   *      state = [[ 'file_type', 'pdf' ]]
   *      filtered = []
   *
   *      query = [ 'type', 'publication' ]
   *      state = [['type', 'publication', ['subtype', 'report' ]]
   *      filtered = []
   *
   *      query = ['type', 'publication', ['subtype', 'report']]]
   *      state = [[ 'type', 'publication' ]]
   *      filtered = []
   */

  var anyRemoved = false;
  var filteredStrStates = strStateFilters.filter(function (strStateFilter) {
    var childFilterExists = startsWith(strStateFilter, strQuery);
    var parentFilterExists = startsWith(strQuery, strStateFilter);

    if (childFilterExists && !anyRemoved) {
      anyRemoved = true;
    }

    return !childFilterExists && !parentFilterExists;
  });

  if (!anyRemoved) {
    /**
     * if nothing has been removed, it means it was not previously there, so
     * the user query has to be added.
     * e.g. query = ['type', 'publication', ['subtype', 'report']]
     *      state = []
     *      filtered = [['type', 'publication', ['subtype', 'report']]]
     */
    filteredStrStates.push(strQuery);
  } else {
    /**
     * if a filter has been removed, it might have been a child. Add its parent if it is the root parent.
     * e.g. query = ['type', 'publication', 'subtype', 'report']
     *      state = [['type', 'publication', ['subtype', 'report']]]
     *      filtered = [['type', 'publication']]
     */
    var hasChild = queryFilter.length === 3;

    if (hasChild) {
      var arr = removeLastChild(queryFilter);
      filteredStrStates.push(toString(arr));
    }
  }
  /**
   * convert back to lists
   */


  return filteredStrStates.map(function (strState) {
    return parse(strState);
  });
};
var updateQueryState = function updateQueryState(oldState, newState, storeKeys) {
  var pickedState = _pick(newState, storeKeys);

  if ('filters' in pickedState) {
    pickedState['filters'] = updateQueryFilters(pickedState.filters, oldState.filters);
  }

  return pickedState;
};

var store_keys = ['queryString', 'sortBy', 'sortOrder', 'page', 'size', 'layout', 'filters', 'suggestions'];
var queryReducer = (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SET_QUERY_STRING:
      return _objectSpread2({}, state, {
        queryString: action.payload,
        page: 1
      });

    case SET_QUERY_SORTING:
      return _objectSpread2({}, state, {
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
        page: 1
      });

    case SET_QUERY_SORT_BY:
      return _objectSpread2({}, state, {
        sortBy: action.payload,
        page: 1
      });

    case SET_QUERY_SORT_ORDER:
      return _objectSpread2({}, state, {
        sortOrder: action.payload,
        page: 1
      });

    case SET_QUERY_PAGINATION_PAGE:
      return _objectSpread2({}, state, {
        page: action.payload
      });

    case SET_QUERY_PAGINATION_SIZE:
      return _objectSpread2({}, state, {
        size: action.payload,
        page: 1
      });

    case SET_QUERY_FILTERS:
      {
        return _objectSpread2({}, state, {
          page: 1,
          filters: updateQueryFilters(action.payload, state.filters)
        });
      }

    case SET_QUERY_SUGGESTIONS:
      return _objectSpread2({}, state, {
        suggestions: action.payload.suggestions
      });

    case CLEAR_QUERY_SUGGESTIONS:
      return _objectSpread2({}, state, {
        suggestions: action.payload.suggestions
      });

    case SET_SUGGESTION_STRING:
      return _objectSpread2({}, state, {
        suggestionString: action.payload
      });

    case SET_QUERY_COMPONENT_INITIAL_STATE:
      return _objectSpread2({}, state, {}, action.payload);

    case SET_QUERY_STATE_URL_EXTERNALLY_CHANGED:
      return _objectSpread2({}, state, {}, action.payload);

    case SET_QUERY_STATE:
      return _objectSpread2({}, state, {}, updateQueryState(state, action.payload, store_keys));

    case RESULTS_UPDATE_LAYOUT:
      return _objectSpread2({}, state, {
        layout: action.payload
      });

    case RESET_QUERY:
      return _objectSpread2({}, state, {
        queryString: '',
        page: 1,
        filters: []
      });

    default:
      return state;
  }
});

var resultsReducer = (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case RESULTS_LOADING:
      return _objectSpread2({}, state, {
        loading: true,
        data: _objectSpread2({}, state.data)
      });

    case RESULTS_FETCH_SUCCESS:
      return {
        loading: false,
        data: _objectSpread2({}, state.data, {
          aggregations: action.payload.aggregations,
          hits: action.payload.hits,
          total: action.payload.total
        }),
        error: {}
      };

    case RESULTS_FETCH_ERROR:
      return {
        loading: false,
        data: _objectSpread2({}, state.data, {
          aggregations: {},
          hits: [],
          total: 0
        }),
        error: action.payload
      };

    default:
      return state;
  }
});

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */
var rootReducer = redux.combineReducers({
  query: queryReducer,
  results: resultsReducer
});

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018-2019 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */
function configureStore(appConfig) {
  var initialQueryState = {
    queryString: '',
    suggestions: [],
    sortBy: null,
    sortOrder: null,
    page: 1,
    size: 10,
    filters: [],
    layout: null
  };
  var initialResultsState = {
    loading: false,
    data: {
      hits: [],
      total: 0,
      aggregations: {}
    },
    error: {}
  }; // configure the initial state

  var preloadedQueryState = appConfig.urlHandlerApi ? appConfig.urlHandlerApi.get(initialQueryState) : initialQueryState;
  var preloadedState = {
    query: preloadedQueryState,
    results: initialResultsState
  };
  return redux.createStore(rootReducer, preloadedState, redux.applyMiddleware(thunk.withExtraArgument(appConfig)));
}

function connectExtended(mapStateToProps, mapDispatchToProps, mergeProps) {
  return reactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps);
}

var setInitialState = function setInitialState(initialState) {
  return function (dispatch) {
    dispatch({
      type: SET_QUERY_COMPONENT_INITIAL_STATE,
      payload: initialState
    });
  };
};
var onAppInitialized = function onAppInitialized(searchOnInit) {
  return function (dispatch) {
    if (searchOnInit) {
      dispatch(executeQuery({
        shouldUpdateUrlQueryString: false
      }));
    }
  };
};
var onBrowserHistoryExternallyChanged = function onBrowserHistoryExternallyChanged() {
  return function (dispatch, getState, config) {
    var urlHandlerApi = config.urlHandlerApi;

    if (urlHandlerApi) {
      var currentStateQuery = getState().query;
      var newStateQuery = urlHandlerApi.get(currentStateQuery);
      dispatch({
        type: SET_QUERY_STATE_URL_EXTERNALLY_CHANGED,
        payload: newStateQuery
      });
      dispatch(executeQuery({
        shouldUpdateUrlQueryString: false,
        shouldReplaceUrlQueryString: true
      }));
    }
  };
};
var updateQueryString = function updateQueryString(queryString) {
  return function (dispatch) {
    dispatch({
      type: SET_QUERY_STRING,
      payload: queryString
    });
    dispatch(executeQuery());
  };
};
var updateQuerySorting = function updateQuerySorting(sortByValue, sortOrderValue) {
  return function (dispatch) {
    dispatch({
      type: SET_QUERY_SORTING,
      payload: {
        sortBy: sortByValue,
        sortOrder: sortOrderValue
      }
    });
    dispatch(executeQuery());
  };
};
var updateQuerySortBy = function updateQuerySortBy(sortByValue) {
  return function (dispatch) {
    dispatch({
      type: SET_QUERY_SORT_BY,
      payload: sortByValue
    });
    dispatch(executeQuery());
  };
};
var updateQuerySortOrder = function updateQuerySortOrder(sortOrderValue) {
  return function (dispatch) {
    dispatch({
      type: SET_QUERY_SORT_ORDER,
      payload: sortOrderValue
    });
    dispatch(executeQuery());
  };
};
var updateQueryPaginationPage = function updateQueryPaginationPage(page) {
  return function (dispatch) {
    dispatch({
      type: SET_QUERY_PAGINATION_PAGE,
      payload: page
    });
    dispatch(executeQuery());
  };
};
var updateQueryPaginationSize = function updateQueryPaginationSize(size) {
  return function (dispatch) {
    dispatch({
      type: SET_QUERY_PAGINATION_SIZE,
      payload: size
    });
    dispatch(executeQuery());
  };
};
var updateQueryFilters$1 = function updateQueryFilters(filters) {
  return function (dispatch) {
    dispatch({
      type: SET_QUERY_FILTERS,
      payload: filters
    });
    dispatch(executeQuery());
  };
};
var updateResultsLayout = function updateResultsLayout(layout) {
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee(dispatch, getState, config) {
        var urlHandlerApi, newStateQuery;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                urlHandlerApi = config.urlHandlerApi;

                if (!urlHandlerApi) {
                  _context.next = 8;
                  break;
                }

                _context.next = 4;
                return dispatch({
                  type: RESULTS_UPDATE_LAYOUT,
                  payload: layout
                });

              case 4:
                newStateQuery = getState().query;
                urlHandlerApi.set(newStateQuery);
                _context.next = 9;
                break;

              case 8:
                dispatch({
                  type: RESULTS_UPDATE_LAYOUT,
                  payload: layout
                });

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }()
  );
};
var resetQuery = function resetQuery() {
  return function (dispatch) {
    dispatch({
      type: RESET_QUERY
    });
    dispatch(executeQuery());
  };
};
var executeQuery = function executeQuery() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$shouldUpdateUrl = _ref2.shouldUpdateUrlQueryString,
      shouldUpdateUrlQueryString = _ref2$shouldUpdateUrl === void 0 ? true : _ref2$shouldUpdateUrl,
      _ref2$shouldReplaceUr = _ref2.shouldReplaceUrlQueryString,
      shouldReplaceUrlQueryString = _ref2$shouldReplaceUr === void 0 ? false : _ref2$shouldReplaceUr;

  return (
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee2(dispatch, getState, config) {
        var queryState, searchApi, urlHandlerApi, response;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                queryState = _cloneDeep(getState().query);
                searchApi = config.searchApi;
                urlHandlerApi = config.urlHandlerApi;

                if (urlHandlerApi) {
                  if (shouldReplaceUrlQueryString) {
                    urlHandlerApi.replace(queryState);
                  } else if (shouldUpdateUrlQueryString) {
                    urlHandlerApi.set(queryState);
                  }
                }

                dispatch({
                  type: RESULTS_LOADING
                });
                _context2.prev = 5;
                _context2.next = 8;
                return searchApi.search(queryState);

              case 8:
                response = _context2.sent;
                dispatch({
                  type: RESULTS_FETCH_SUCCESS,
                  payload: {
                    aggregations: response.aggregations,
                    hits: response.hits,
                    total: response.total
                  }
                });
                _context2.next = 16;
                break;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](5);
                console.error(_context2.t0);
                dispatch({
                  type: RESULTS_FETCH_ERROR,
                  payload: _context2.t0
                });

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[5, 12]]);
      }));

      return function (_x4, _x5, _x6) {
        return _ref3.apply(this, arguments);
      };
    }()
  );
};
var updateSuggestions = function updateSuggestions(suggestionString) {
  return function (dispatch) {
    dispatch({
      type: SET_SUGGESTION_STRING,
      payload: suggestionString
    });
    dispatch(executeSuggestionQuery());
  };
};
var executeSuggestionQuery = function executeSuggestionQuery() {
  return (
    /*#__PURE__*/
    function () {
      var _ref4 = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee3(dispatch, getState, config) {
        var queryState, suggestionApi, response;
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                queryState = _cloneDeep(getState().query);
                suggestionApi = config.suggestionApi;
                _context3.prev = 2;
                _context3.next = 5;
                return suggestionApi.search(queryState);

              case 5:
                response = _context3.sent;
                dispatch({
                  type: SET_QUERY_SUGGESTIONS,
                  payload: {
                    suggestions: response.suggestions
                  }
                });
                _context3.next = 12;
                break;

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](2);
                console.error('Could not load suggestions due to: ' + _context3.t0);

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[2, 9]]);
      }));

      return function (_x7, _x8, _x9) {
        return _ref4.apply(this, arguments);
      };
    }()
  );
};
var clearSuggestions = function clearSuggestions() {
  return function (dispatch) {
    dispatch({
      type: CLEAR_QUERY_SUGGESTIONS,
      payload: {
        suggestions: []
      }
    });
  };
};
var updateQueryState$1 = function updateQueryState(queryState) {
  return function (dispatch) {
    dispatch({
      type: SET_QUERY_STATE,
      payload: queryState
    });
    dispatch(executeQuery());
  };
};

var ActiveFilters =
/*#__PURE__*/
function (_Component) {
  _inherits(ActiveFilters, _Component);

  function ActiveFilters(props) {
    var _this;

    _classCallCheck(this, ActiveFilters);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ActiveFilters).call(this, props));

    _this._getLabel = function (filter) {
      var aggName = filter[0];
      var value = filter[1];
      var currentFilter = [aggName, value];
      var hasChild = filter.length === 3;

      if (hasChild) {
        var _this$_getLabel = _this._getLabel(filter[2]),
            label = _this$_getLabel.label,
            activeFilter = _this$_getLabel.activeFilter;

        value = "".concat(value, ".").concat(label);
        currentFilter.push(activeFilter);
      }

      return {
        label: value,
        activeFilter: currentFilter
      };
    };

    _this._renderElement = function (filters, removeActiveFilter) {
      return filters.map(function (filter, index) {
        var _this$_getLabel2 = _this._getLabel(filter),
            label = _this$_getLabel2.label,
            activeFilter = _this$_getLabel2.activeFilter;

        return React__default.createElement(semanticUiReact.Label, {
          image: true,
          key: index,
          onClick: function onClick() {
            return removeActiveFilter(activeFilter);
          }
        }, label, React__default.createElement(semanticUiReact.Icon, {
          name: "delete"
        }));
      });
    };

    _this.updateQueryFilters = props.updateQueryFilters;
    _this.renderElement = props.renderElement || _this._renderElement;
    _this.renderActiveFilters = props.renderActiveFilters || _this._renderActiveFilters;
    return _this;
  }

  _createClass(ActiveFilters, [{
    key: "render",
    value: function render() {
      var filters = this.props.filters;
      return filters.length ? this.renderElement(filters, this.updateQueryFilters) : null;
    }
  }]);

  return ActiveFilters;
}(React.Component);
ActiveFilters.defaultProps = {
  renderElement: null
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018-2019 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    updateQueryFilters: function updateQueryFilters(filter) {
      return dispatch(updateQueryFilters$1(filter));
    }
  };
};

var ActiveFilters$1 = connectExtended(function (state) {
  return {
    filters: state.query.filters
  };
}, mapDispatchToProps)(ActiveFilters);

var BucketAggregationValues =
/*#__PURE__*/
function (_Component) {
  _inherits(BucketAggregationValues, _Component);

  function BucketAggregationValues(props) {
    var _this;

    _classCallCheck(this, BucketAggregationValues);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BucketAggregationValues).call(this, props));

    _this._isSelected = function (aggName, value, selectedFilters) {
      // return True there is at least one filter that has this value
      return selectedFilters.filter(function (filter) {
        return filter[0] === aggName && filter[1] === value;
      }).length >= 1;
    };

    _this.getChildAggCmps = function (bucket, selectedFilters) {
      var hasChildAggregation = _this.childAgg && _this.childAgg['aggName'] in bucket;
      var selectedChildFilters = [];

      if (hasChildAggregation) {
        var childBuckets = bucket[_this.childAgg['aggName']]['buckets'];
        selectedFilters.forEach(function (filter) {
          var isThisAggregation = filter[0] === _this.aggName;
          var isThisValue = filter[1] === bucket.key;
          var hasChild = filter.length === 3;

          if (isThisAggregation && isThisValue && hasChild) {
            selectedChildFilters.push(filter[2]);
          }
        });

        var onFilterClicked = function onFilterClicked(value) {
          _this.onFilterClicked([_this.aggName, bucket.key, value]);
        };

        return React__default.createElement(BucketAggregationValues, {
          buckets: childBuckets,
          selectedFilters: selectedChildFilters,
          field: _this.childAgg.field,
          aggName: _this.childAgg.aggName,
          childAgg: _this.childAgg.childAgg,
          onFilterClicked: onFilterClicked,
          renderContainerElement: _this.renderContainerElement,
          renderValueElement: _this.renderValueElement
        });
      }

      return null;
    };

    _this._renderValueElement = function (bucket, isSelected, onFilterClicked, getChildAggCmps) {
      var label = "".concat(bucket.key, " (").concat(bucket.doc_count, ")");
      var childAggCmps = getChildAggCmps(bucket);
      return React__default.createElement(semanticUiReact.List.Item, {
        key: bucket.key
      }, React__default.createElement(semanticUiReact.Checkbox, {
        label: label,
        value: bucket.key,
        onClick: function onClick() {
          return onFilterClicked(bucket.key);
        },
        checked: isSelected
      }), childAggCmps);
    };

    _this._renderContainerElement = function (valuesCmp) {
      return React__default.createElement(semanticUiReact.List, null, valuesCmp);
    };

    _this.field = props.field;
    _this.aggName = props.aggName;
    _this.childAgg = props.childAgg;
    _this.onFilterClicked = props.onFilterClicked;
    _this.renderContainerElement = props.renderContainerElement || _this._renderContainerElement;
    _this.renderValueElement = props.renderValueElement || _this._renderValueElement;
    return _this;
  }

  _createClass(BucketAggregationValues, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          buckets = _this$props.buckets,
          selectedFilters = _this$props.selectedFilters;
      var valuesCmp = buckets.map(function (bucket) {
        var isSelected = _this2._isSelected(_this2.aggName, bucket.key, selectedFilters);

        var onFilterClicked = function onFilterClicked(value) {
          _this2.onFilterClicked([_this2.aggName, value]);
        };

        var getChildAggCmps = function getChildAggCmps(bucket) {
          return _this2.getChildAggCmps(bucket, selectedFilters);
        };

        return _this2.renderValueElement(bucket, isSelected, onFilterClicked, getChildAggCmps);
      });
      return this.renderContainerElement(valuesCmp);
    }
  }]);

  return BucketAggregationValues;
}(React.Component);
BucketAggregationValues.defaultProps = {
  renderContainerElement: null,
  renderValueElement: null
};

var BucketAggregation =
/*#__PURE__*/
function (_Component) {
  _inherits(BucketAggregation, _Component);

  function BucketAggregation(props) {
    var _this;

    _classCallCheck(this, BucketAggregation);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BucketAggregation).call(this, props));

    _this.onFilterClicked = function (filter) {
      _this.updateQueryFilters(filter);
    };

    _this._renderValues = function (resultBuckets, selectedFilters) {
      return React__default.createElement(BucketAggregationValues, {
        buckets: resultBuckets,
        selectedFilters: selectedFilters,
        field: _this.agg.field,
        aggName: _this.agg.aggName,
        childAgg: _this.agg.childAgg,
        onFilterClicked: _this.onFilterClicked,
        renderContainerElement: _this.props.renderValuesContainerElement,
        renderValueElement: _this.props.renderValueElement
      });
    };

    _this._renderElement = function (title, containerCmp) {
      return containerCmp ? React__default.createElement(semanticUiReact.Card, null, React__default.createElement(semanticUiReact.Card.Content, null, React__default.createElement(semanticUiReact.Card.Header, null, title)), React__default.createElement(semanticUiReact.Card.Content, null, containerCmp)) : null;
    };

    _this._getSelectedFilters = function (userSelectionFilters) {
      // get selected filters for this field only
      return userSelectionFilters.filter(function (filter) {
        return filter[0] === _this.agg.aggName;
      });
    };

    _this._getResultBuckets = function (resultsAggregations) {
      // get buckets of this field
      var thisAggs = _get$1(resultsAggregations, _this.agg.aggName, {});

      return 'buckets' in thisAggs ? thisAggs['buckets'] : [];
    };

    _this.title = props.title;
    _this.agg = props.agg;
    _this.updateQueryFilters = props.updateQueryFilters;
    _this.renderElement = props.renderElement || _this._renderElement;
    return _this;
  }

  _createClass(BucketAggregation, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          userSelectionFilters = _this$props.userSelectionFilters,
          resultsAggregations = _this$props.resultsAggregations;

      var selectedFilters = this._getSelectedFilters(userSelectionFilters);

      var resultBuckets = this._getResultBuckets(resultsAggregations);

      var valuesCmp = resultBuckets.length ? this._renderValues(resultBuckets, selectedFilters) : null;
      return this.renderElement(this.title, valuesCmp);
    }
  }]);

  return BucketAggregation;
}(React.Component);
BucketAggregation.defaultProps = {
  renderElement: null,
  renderValuesContainerElement: null,
  renderValueElement: null
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2019 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

var mapDispatchToProps$1 = function mapDispatchToProps(dispatch) {
  return {
    updateQueryFilters: function updateQueryFilters(filter) {
      return dispatch(updateQueryFilters$1(filter));
    }
  };
};

var BucketAggregation$1 = connectExtended(function (state) {
  return {
    userSelectionFilters: state.query.filters,
    resultsAggregations: state.results.data.aggregations
  };
}, mapDispatchToProps$1)(BucketAggregation);

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".AutoCompleteText{position:relative;z-index:100}.AutoCompleteText .input button,.AutoCompleteText .input input{border:none;border-radius:0}.AutoCompleteText ul{width:100%;position:absolute;list-style-type:none;text-align:left;color:#000;background-color:#fff;margin:0;padding:0;border:1px solid #e0e1e2;border-radius:0 0 .3rem .3rem}.AutoCompleteText ul:before{content:\"\"}.AutoCompleteText li{padding:.3em 1em;cursor:pointer}.AutoCompleteText li:hover{text-decoration:underline;background-color:#e0e1e2;border-radius:.3rem}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9saWIvY29tcG9uZW50cy9BdXRvY29tcGxldGVTZWFyY2hCYXIvQXV0b2NvbXBsZXRlU2VhcmNoQmFyLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsa0JBQ0UsaUJBQWtCLENBQ2xCLFdBQVksQ0FRZCwrREFDRSxXQUFZLENBQ1osZUFBZ0IsQ0FHbEIscUJBQ0UsVUFBVyxDQUNYLGlCQUFrQixDQUNsQixvQkFBcUIsQ0FDckIsZUFBZ0IsQ0FDaEIsVUFBWSxDQUNaLHFCQUF1QixDQUN2QixRQUFTLENBQ1QsU0FBVSxDQUNWLHdCQUFvQyxDQUNwQyw2QkFBZ0MsQ0FHbEMsNEJBQ0UsVUFBVyxDQUdiLHFCQUNFLGdCQUFrQixDQUNsQixjQUFlLENBR2pCLDJCQUNFLHlCQUEwQixDQUMxQix3QkFBb0MsQ0FDcEMsbUJBQXFCIiwiZmlsZSI6IkF1dG9jb21wbGV0ZVNlYXJjaEJhci5zY3NzIn0= */";
styleInject(css);

var AutocompleteSearchBar =
/*#__PURE__*/
function (_Component) {
  _inherits(AutocompleteSearchBar, _Component);

  function AutocompleteSearchBar(props) {
    var _this;

    _classCallCheck(this, AutocompleteSearchBar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AutocompleteSearchBar).call(this, props));

    _this._handleAutocompleteChange = function (suggestionString) {
      if (suggestionString.length >= _this.minCharsToAutocomplete) {
        _this.updateSuggestions(suggestionString);
      }
    };

    _this.onInputChange =
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee(queryString) {
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.setState({
                  currentValue: queryString
                });

              case 2:
                _this.handleAutocompleteChange(_this.state.currentValue);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();

    _this.executeSearch = function () {
      _this.updateQueryString(_this.state.currentValue);
    };

    _this.updateQueryString = _this.props.updateQueryString;
    _this.updateSuggestions = _this.props.debounce ? _.debounce(_this.props.updateSuggestions, _this.props.debounceTime, {
      leading: true
    }) : _this.props.updateSuggestions;
    _this.clearSuggestions = _this.props.clearSuggestions;
    _this.minCharsToAutocomplete = _this.props.minCharsToAutocomplete;
    _this.state = {
      currentValue: _this.props.queryString || ''
    };
    _this.renderElement = props.renderElement || _this._renderElement;
    _this.renderSuggestions = props.renderSuggestions || _this._renderSuggestions;
    _this.handleAutocompleteChange = props.handleAutocompleteChange || _this._handleAutocompleteChange;
    return _this;
  }

  _createClass(AutocompleteSearchBar, [{
    key: "_renderSuggestions",
    value: function _renderSuggestions(querySuggestions) {
      var _this2 = this;

      var onSuggestionSelected =
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(
        /*#__PURE__*/
        regenerator.mark(function _callee2(suggestion) {
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return _this2.setState({
                    currentValue: suggestion
                  });

                case 2:
                  _this2.clearSuggestions();

                  _this2.executeSearch();

                case 4:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        return function onSuggestionSelected(_x2) {
          return _ref2.apply(this, arguments);
        };
      }();

      if (querySuggestions.length === 0) {
        return null;
      }

      return React__default.createElement("ul", null, querySuggestions.map(function (text) {
        return React__default.createElement("li", {
          onClick: function onClick() {
            return onSuggestionSelected(text);
          },
          key: text
        }, text);
      }));
    }
  }, {
    key: "_renderElement",
    value: function _renderElement(placeholder, queryString, querySuggestions, onInputChange, executeSearch) {
      var onBtnSearchClick = function onBtnSearchClick(event, input) {
        executeSearch();
      };

      var onKeyPress = function onKeyPress(event, input) {
        if (event.key === 'Enter') {
          executeSearch();
        }
      };

      return React__default.createElement("div", {
        className: "AutoCompleteText"
      }, React__default.createElement(semanticUiReact.Input, {
        action: {
          content: 'Search',
          onClick: onBtnSearchClick
        },
        fluid: true,
        placeholder: placeholder,
        onChange: function onChange(event, _ref3) {
          var value = _ref3.value;
          onInputChange(value);
        },
        value: queryString,
        onKeyPress: onKeyPress
      }), this.renderSuggestions(querySuggestions));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          placeholder = _this$props.placeholder,
          suggestions = _this$props.suggestions;
      return this.renderElement(placeholder, this.state.currentValue, suggestions, this.onInputChange, this.executeSearch);
    }
  }]);

  return AutocompleteSearchBar;
}(React.Component);

AutocompleteSearchBar.defaultProps = {
  renderElement: null,
  renderSuggestions: null,
  handleAutocompleteChange: null,
  placeholder: 'Type something',
  minCharsToAutocomplete: 3
};

var AutocompleteSearchBarUncontrolled = function AutocompleteSearchBarUncontrolled(props) {
  return React__default.createElement(AutocompleteSearchBar, Object.assign({
    key: props.queryString
  }, props));
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2019 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

var mapDispatchToProps$2 = function mapDispatchToProps(dispatch) {
  return {
    updateQueryString: function updateQueryString$1(query) {
      return dispatch(updateQueryString(query));
    },
    updateSuggestions: function updateSuggestions$1(query) {
      return dispatch(updateSuggestions(query));
    },
    clearSuggestions: function clearSuggestions$1() {
      return dispatch(clearSuggestions());
    }
  };
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    queryString: state.query.queryString,
    suggestions: state.query.suggestions
  };
};

var AutocompleteSearchBar$1 = connectExtended(mapStateToProps, mapDispatchToProps$2)(AutocompleteSearchBarUncontrolled);

var ShouldRender =
/*#__PURE__*/
function (_Component) {
  _inherits(ShouldRender, _Component);

  function ShouldRender() {
    _classCallCheck(this, ShouldRender);

    return _possibleConstructorReturn(this, _getPrototypeOf(ShouldRender).apply(this, arguments));
  }

  _createClass(ShouldRender, [{
    key: "render",
    value: function render() {
      var condition = this.props.condition;
      return condition ? React__default.createElement(React.Fragment, null, this.props.children) : null;
    }
  }]);

  return ShouldRender;
}(React.Component);
ShouldRender.defaultProps = {
  condition: true
};

var Count =
/*#__PURE__*/
function (_Component) {
  _inherits(Count, _Component);

  function Count(props) {
    var _this;

    _classCallCheck(this, Count);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Count).call(this, props));
    _this.renderElement = props.renderElement || _this._renderElement;
    return _this;
  }

  _createClass(Count, [{
    key: "_renderElement",
    value: function _renderElement(totalResults) {
      return React__default.createElement(semanticUiReact.Label, {
        color: 'blue'
      }, totalResults);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          loading = _this$props.loading,
          totalResults = _this$props.totalResults;
      return React__default.createElement(ShouldRender, {
        condition: !loading && totalResults > 0
      }, this.renderElement(totalResults));
    }
  }]);

  return Count;
}(React.Component);
Count.defaultProps = {
  renderElement: null
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */
var Count$1 = connectExtended(function (state) {
  return {
    loading: state.results.loading,
    totalResults: state.results.data.total
  };
})(Count);

var EmptyResults =
/*#__PURE__*/
function (_Component) {
  _inherits(EmptyResults, _Component);

  function EmptyResults(props) {
    var _this;

    _classCallCheck(this, EmptyResults);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EmptyResults).call(this, props));

    _this._renderElement = function (queryString, resetQuery) {
      return React__default.createElement(semanticUiReact.Segment, {
        placeholder: true,
        textAlign: "center"
      }, React__default.createElement(semanticUiReact.Header, {
        icon: true
      }, React__default.createElement(semanticUiReact.Icon, {
        name: "search"
      }), "No results found!"), React__default.createElement("em", null, "Current search \"", queryString, "\""), React__default.createElement("br", null), React__default.createElement(semanticUiReact.Button, {
        primary: true,
        onClick: function onClick() {
          return resetQuery();
        }
      }, "Clear query"));
    };

    _this.resetQuery = props.resetQuery;
    _this.renderElement = props.renderElement || _this._renderElement;
    return _this;
  }

  _createClass(EmptyResults, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          loading = _this$props.loading,
          totalResults = _this$props.totalResults,
          error = _this$props.error,
          queryString = _this$props.queryString;
      return React__default.createElement(ShouldRender, {
        condition: !loading && _isEmpty(error) && totalResults === 0
      }, this.renderElement(queryString, this.resetQuery));
    }
  }]);

  return EmptyResults;
}(React.Component);
EmptyResults.defaultProps = {
  queryString: '',
  renderElement: null
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

var mapDispatchToProps$3 = function mapDispatchToProps(dispatch) {
  return {
    resetQuery: function resetQuery$1() {
      return dispatch(resetQuery());
    }
  };
};

var EmptyResults$1 = connectExtended(function (state) {
  return {
    loading: state.results.loading,
    totalResults: state.results.data.total,
    error: state.results.error,
    queryString: state.query.queryString
  };
}, mapDispatchToProps$3)(EmptyResults);

var Error$1 =
/*#__PURE__*/
function (_Component) {
  _inherits(Error, _Component);

  function Error(props) {
    var _this;

    _classCallCheck(this, Error);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Error).call(this, props));

    _this._renderElement = function (error) {
      return React__default.createElement("div", null, "Oups! Something went wrong while fetching results.");
    };

    _this.renderElement = props.renderElement || _this._renderElement;
    return _this;
  }

  _createClass(Error, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          loading = _this$props.loading,
          error = _this$props.error;
      return React__default.createElement(ShouldRender, {
        condition: !loading && !_isEmpty(error)
      }, React__default.createElement(React.Fragment, null, this.renderElement(error)));
    }
  }]);

  return Error;
}(React.Component);
Error$1.defaultProps = {
  renderElement: null
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */
var Error$2 = connectExtended(function (state) {
  return {
    loading: state.results.loading,
    error: state.results.error
  };
})(Error$1);

var LayoutSwitcher =
/*#__PURE__*/
function (_Component) {
  _inherits(LayoutSwitcher, _Component);

  function LayoutSwitcher(props) {
    var _this;

    _classCallCheck(this, LayoutSwitcher);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LayoutSwitcher).call(this, props));

    _this._renderElement = function (currentLayout, onLayoutChange) {
      var clickHandler = function clickHandler(event, _ref) {
        var name = _ref.name;
        onLayoutChange(name);
      };

      return React__default.createElement(semanticUiReact.Menu, {
        compact: true,
        icon: true
      }, React__default.createElement(semanticUiReact.Menu.Item, {
        name: "list",
        active: currentLayout === 'list',
        onClick: clickHandler
      }, React__default.createElement(semanticUiReact.Icon, {
        name: "list layout"
      })), React__default.createElement(semanticUiReact.Menu.Item, {
        name: "grid",
        active: currentLayout === 'grid',
        onClick: clickHandler
      }, React__default.createElement(semanticUiReact.Icon, {
        name: "grid layout"
      })));
    };

    _this.onLayoutChange = function (layoutName) {
      _this.updateLayout(layoutName);
    };

    _this.defaultValue = _this.props.defaultLayout;
    _this.updateLayout = props.updateLayout;
    _this.setInitialState = props.setInitialState;
    _this.renderElement = props.renderElement || _this._renderElement;
    return _this;
  }

  _createClass(LayoutSwitcher, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.currentLayout === null) {
        this.setInitialState({
          layout: this.defaultValue
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          currentLayout = _this$props.currentLayout,
          loading = _this$props.loading,
          totalResults = _this$props.totalResults;
      return React__default.createElement(ShouldRender, {
        condition: currentLayout !== null && !loading && totalResults > 0
      }, this.renderElement(currentLayout, this.onLayoutChange));
    }
  }]);

  return LayoutSwitcher;
}(React.Component);
LayoutSwitcher.defaultProps = {
  defaultLayout: 'list',
  currentLayout: null,
  renderElement: null
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

var mapDispatchToProps$4 = function mapDispatchToProps(dispatch) {
  return {
    updateLayout: function updateLayout(layout) {
      return dispatch(updateResultsLayout(layout));
    },
    setInitialState: function setInitialState$1(initialState) {
      return dispatch(setInitialState(initialState));
    }
  };
};

var LayoutSwitcher$1 = connectExtended(function (state) {
  return {
    loading: state.results.loading,
    currentLayout: state.query.layout,
    totalResults: state.results.data.total
  };
}, mapDispatchToProps$4)(LayoutSwitcher);

var ResultsLoader =
/*#__PURE__*/
function (_Component) {
  _inherits(ResultsLoader, _Component);

  function ResultsLoader(props) {
    var _this;

    _classCallCheck(this, ResultsLoader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResultsLoader).call(this, props));

    _this._renderElement = function () {
      return React__default.createElement(semanticUiReact.Loader, {
        active: true,
        size: "huge",
        inline: "centered"
      });
    };

    _this.renderElement = props.renderElement || _this._renderElement;
    return _this;
  }

  _createClass(ResultsLoader, [{
    key: "render",
    value: function render() {
      return this.props.loading ? this.renderElement() : this.props.children;
    }
  }]);

  return ResultsLoader;
}(React.Component);
ResultsLoader.defaultProps = {
  renderElement: null
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */
var ResultsLoader$1 = connectExtended(function (state) {
  return {
    loading: state.results.loading
  };
})(ResultsLoader);

var Pagination =
/*#__PURE__*/
function (_Component) {
  _inherits(Pagination, _Component);

  function Pagination(props) {
    var _this;

    _classCallCheck(this, Pagination);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Pagination).call(this, props));

    _this.onPageChange = function (activePage) {
      if (activePage === _this.props.currentPage) return;

      _this.updateQueryPage(activePage);
    };

    _this._renderElement = function (currentPage, currentSize, totalResults, onPageChange, options) {
      var pages = Math.ceil(totalResults / currentSize);
      var boundaryRangeCount = options.boundaryRangeCount;
      var siblingRangeCount = options.siblingRangeCount;
      var showEllipsis = options.showEllipsis;
      var showFirst = options.showFirst;
      var showLast = options.showLast;
      var showPrev = options.showPrev;
      var showNext = options.showNext;

      var _onPageChange = function _onPageChange(event, _ref) {
        var activePage = _ref.activePage;
        onPageChange(activePage);
      };

      for (var _len = arguments.length, extraParams = new Array(_len > 5 ? _len - 5 : 0), _key = 5; _key < _len; _key++) {
        extraParams[_key - 5] = arguments[_key];
      }

      return React__default.createElement(semanticUiReact.Pagination, Object.assign({
        activePage: currentPage,
        totalPages: pages,
        onPageChange: _onPageChange,
        boundaryRange: boundaryRangeCount,
        siblingRange: siblingRangeCount,
        ellipsisItem: showEllipsis ? undefined : null,
        firstItem: showFirst ? undefined : null,
        lastItem: showLast ? undefined : null,
        prevItem: showPrev ? undefined : null,
        nextItem: showNext ? undefined : null
      }, extraParams));
    };

    _this.defaultValue = props.defaultValue;
    _this.updateQueryPage = props.updateQueryPage;
    _this.setInitialState = props.setInitialState;
    _this.renderElement = props.renderElement || _this._renderElement;
    return _this;
  }

  _createClass(Pagination, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.currentPage === -1) {
        this.setInitialState({
          page: this.defaultValue
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          loading = _this$props.loading,
          totalResults = _this$props.totalResults,
          currentPage = _this$props.currentPage,
          currentSize = _this$props.currentSize,
          options = _this$props.options;
      return React__default.createElement(ShouldRender, {
        condition: !loading && currentPage > -1 && currentSize > -1 && totalResults > 0
      }, this.renderElement(currentPage, currentSize, totalResults, this.onPageChange, options));
    }
  }]);

  return Pagination;
}(React.Component);
Pagination.defaultProps = {
  options: {
    boundaryRangeCount: 1,
    siblingRangeCount: 1,
    showEllipsis: true,
    showFirst: true,
    showLast: true,
    showPrev: true,
    showNext: true
  },
  defaultValue: 10,
  renderElement: null
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

var mapDispatchToProps$5 = function mapDispatchToProps(dispatch) {
  return {
    updateQueryPage: function updateQueryPage(page) {
      return dispatch(updateQueryPaginationPage(page));
    },
    setInitialState: function setInitialState$1(value) {
      return dispatch(setInitialState(value));
    }
  };
};

var Pagination$1 = connectExtended(function (state) {
  return {
    currentPage: state.query.page,
    currentSize: state.query.size,
    loading: state.results.loading,
    totalResults: state.results.data.total
  };
}, mapDispatchToProps$5)(Pagination);

var Bootstrap =
/*#__PURE__*/
function (_Component) {
  _inherits(Bootstrap, _Component);

  function Bootstrap(props) {
    var _this;

    _classCallCheck(this, Bootstrap);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Bootstrap).call(this, props));

    _this.updateQueryState = function (query) {
      return _this.props.updateQueryState(query);
    };

    _this.onQueryChanged = function (_ref) {
      var payload = _ref.detail;
      var appReceiver = payload.app || _this.app;

      if (appReceiver === _this.app) {
        _this.updateQueryState(payload.search_query);
      }
    };

    _this.app = props.app;
    _this.searchOnInit = props.searchOnInit;
    _this.historyListen = props.historyListen;
    _this.eventListenerEnabled = props.eventListenerEnabled;
    _this.onAppInitialized = props.onAppInitialized;
    _this.onBrowserHistoryExternallyChanged = props.onBrowserHistoryExternallyChanged;
    _this.searchOnUrlQueryStringChanged = props.searchOnUrlQueryStringChanged;
    return _this;
  }

  _createClass(Bootstrap, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      if (this.historyListen) {
        this.historyUnlisten = this.historyListen(function () {
          _this2.onBrowserHistoryExternallyChanged();
        });
      }

      if (this.eventListenerEnabled) {
        window.addEventListener('queryChanged', this.onQueryChanged);
      }

      window.onpopstate = function () {
        _this2.searchOnUrlQueryStringChanged();
      };

      this.onAppInitialized(this.searchOnInit);
    }
  }, {
    key: "render",
    value: function render() {
      return React__default.createElement(React.Fragment, null, this.props.children);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.historyUnlisten && this.historyUnlisten();

      window.onpopstate = function () {};

      window.removeEventListener('queryChanged', this.onQueryChanged);
    }
  }]);

  return Bootstrap;
}(React.Component);
Bootstrap.defaultProps = {
  searchOnInit: true,
  historyListen: null
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018-2019 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

var mapDispatchToProps$6 = function mapDispatchToProps(dispatch) {
  return {
    onAppInitialized: function onAppInitialized$1(searchOnInit) {
      return dispatch(onAppInitialized(searchOnInit));
    },
    onBrowserHistoryExternallyChanged: function onBrowserHistoryExternallyChanged$1() {
      return dispatch(onBrowserHistoryExternallyChanged());
    },
    updateQueryState: function updateQueryState(queryState) {
      return dispatch(updateQueryState$1(queryState));
    },
    searchOnUrlQueryStringChanged: function searchOnUrlQueryStringChanged() {
      return dispatch(executeQuery({
        shouldUpdateUrlQueryString: false
      }));
    }
  };
};

var Bootstrap$1 = connectExtended(null, mapDispatchToProps$6)(Bootstrap);

var ReactSearchKit =
/*#__PURE__*/
function (_Component) {
  _inherits(ReactSearchKit, _Component);

  function ReactSearchKit(props) {
    var _this;

    _classCallCheck(this, ReactSearchKit);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ReactSearchKit).call(this, props));
    var appConfig = {
      searchApi: props.searchApi,
      suggestionApi: props.suggestionApi,
      urlHandlerApi: props.urlHandlerApi.enabled ? props.urlHandlerApi.customHandler || new UrlHandlerApi(props.urlHandlerApi.overrideConfig) : null,
      defaultSortByOnEmptyQuery: props.defaultSortByOnEmptyQuery
    };
    _this.historyListen = props.history ? props.history.listen : null;
    _this.store = configureStore(appConfig);
    _this.app = props.app;
    _this.eventListenerEnabled = props.eventListenerEnabled;
    return _this;
  }

  _createClass(ReactSearchKit, [{
    key: "render",
    value: function render() {
      var searchOnInit = this.props.searchOnInit;
      return React__default.createElement(reactRedux.Provider, {
        store: this.store
      }, React__default.createElement(Bootstrap$1, {
        searchOnInit: searchOnInit,
        historyListen: this.historyListen,
        app: this.app,
        eventListenerEnabled: this.eventListenerEnabled
      }, this.props.children));
    }
  }]);

  return ReactSearchKit;
}(React.Component);
ReactSearchKit.defaultProps = {
  suggestionApi: null,
  urlHandlerApi: {
    enabled: true,
    overrideConfig: {},
    customHandler: null
  },
  searchOnInit: true,
  defaultSortByOnEmptyQuery: null,
  history: null,
  app: 'RSK',
  eventListenerEnabled: true
};

var ResultsGrid =
/*#__PURE__*/
function (_Component) {
  _inherits(ResultsGrid, _Component);

  function ResultsGrid(props) {
    var _this;

    _classCallCheck(this, ResultsGrid);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResultsGrid).call(this, props));
    _this.renderElement = props.renderElement || _this._renderElement;
    _this.renderGridItem = props.renderGridItem || _this._renderGridItem;
    return _this;
  }

  _createClass(ResultsGrid, [{
    key: "_renderGridItem",
    value: function _renderGridItem(result, index) {
      return React__default.createElement(semanticUiReact.Card, {
        fluid: true,
        key: index,
        href: "#".concat(result.id)
      }, React__default.createElement(semanticUiReact.Image, {
        src: result.imgSrc || 'http://placehold.it/200'
      }), React__default.createElement(semanticUiReact.Card.Content, null, React__default.createElement(semanticUiReact.Card.Header, null, result.title), React__default.createElement(semanticUiReact.Card.Description, null, result.description)));
    }
  }, {
    key: "_renderElement",
    value: function _renderElement(results, resultsPerRow) {
      var _this2 = this;

      var _results = results.map(function (result, index) {
        return _this2.renderGridItem(result, index);
      });

      return React__default.createElement(semanticUiReact.Card.Group, {
        itemsPerRow: resultsPerRow
      }, _results);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          loading = _this$props.loading,
          totalResults = _this$props.totalResults,
          results = _this$props.results;
      var resultsPerRow = this.props.resultsPerRow;
      return React__default.createElement(ShouldRender, {
        condition: !loading && totalResults > 0
      }, this.renderElement(results, resultsPerRow));
    }
  }]);

  return ResultsGrid;
}(React.Component);
ResultsGrid.defaultProps = {
  resultsPerRow: 3,
  renderElement: null,
  renderGridItem: null
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */
var ResultsGrid$1 = connectExtended(function (state) {
  return {
    loading: state.results.loading,
    totalResults: state.results.data.total,
    results: state.results.data.hits
  };
})(ResultsGrid);

var ResultsList =
/*#__PURE__*/
function (_Component) {
  _inherits(ResultsList, _Component);

  function ResultsList(props) {
    var _this;

    _classCallCheck(this, ResultsList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResultsList).call(this, props));
    _this.renderElement = props.renderElement || _this._renderElement;
    _this.renderListItem = props.renderListItem || _this._renderListItem;
    return _this;
  }

  _createClass(ResultsList, [{
    key: "_renderListItem",
    value: function _renderListItem(result, index) {
      return React__default.createElement(semanticUiReact.Item, {
        key: index,
        href: "#".concat(result.id)
      }, React__default.createElement(semanticUiReact.Item.Image, {
        size: "small",
        src: result.imgSrc || 'http://placehold.it/200'
      }), React__default.createElement(semanticUiReact.Item.Content, null, React__default.createElement(semanticUiReact.Item.Header, null, result.title), React__default.createElement(semanticUiReact.Item.Description, null, result.description)));
    }
  }, {
    key: "_renderElement",
    value: function _renderElement(results) {
      var _this2 = this;

      var _results = results.map(function (result, index) {
        return _this2.renderListItem(result, index);
      });

      return React__default.createElement(semanticUiReact.Item.Group, {
        divided: true,
        relaxed: true,
        link: true
      }, _results);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          loading = _this$props.loading,
          totalResults = _this$props.totalResults,
          results = _this$props.results;
      return React__default.createElement(ShouldRender, {
        condition: !loading && totalResults > 0
      }, this.renderElement(results));
    }
  }]);

  return ResultsList;
}(React.Component);
ResultsList.defaultProps = {
  renderElement: null,
  renderListItem: null
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */
var ResultsList$1 = connectExtended(function (state) {
  return {
    loading: state.results.loading,
    totalResults: state.results.data.total,
    results: state.results.data.hits
  };
})(ResultsList);

var ResultsMultiLayout =
/*#__PURE__*/
function (_Component) {
  _inherits(ResultsMultiLayout, _Component);

  function ResultsMultiLayout(props) {
    var _this2 = this;

    var _this;

    _classCallCheck(this, ResultsMultiLayout);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResultsMultiLayout).call(this, props));

    _this._renderElement = function (layout) {
      return layout === 'list' ? React__default.createElement(_this2.ResultsListCmp, null) : React__default.createElement(_this2.ResultsGridCmp, null);
    };

    _this.renderElement = props.renderElement || _this._renderElement;
    _this.ResultsListCmp = props.resultsListCmp || ResultsList$1;
    _this.ResultsGridCmp = props.resultsGridCmp || ResultsGrid$1;
    return _this;
  }

  _createClass(ResultsMultiLayout, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          loading = _this$props.loading,
          totalResults = _this$props.totalResults,
          currentLayout = _this$props.currentLayout;
      return React__default.createElement(ShouldRender, {
        condition: currentLayout != null && !loading && totalResults > 0
      }, this.renderElement(currentLayout));
    }
  }]);

  return ResultsMultiLayout;
}(React.Component);
ResultsMultiLayout.defaultProps = {
  currentLayout: null,
  renderElement: null,
  resultsListCmp: null,
  resultsGridCmp: null
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */
var ResultsMultiLayout$1 = connectExtended(function (state) {
  return {
    loading: state.results.loading,
    totalResults: state.results.data.total,
    currentLayout: state.query.layout
  };
})(ResultsMultiLayout);

var ResultsPerPage =
/*#__PURE__*/
function (_Component) {
  _inherits(ResultsPerPage, _Component);

  function ResultsPerPage(props) {
    var _this;

    _classCallCheck(this, ResultsPerPage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResultsPerPage).call(this, props));

    _this._renderElement = function (currentSize, options, onValueChange) {
      var _options = options.map(function (element, index) {
        return {
          key: index,
          text: element.text,
          value: element.value
        };
      });

      return React__default.createElement(semanticUiReact.Dropdown, {
        inline: true,
        compact: true,
        options: _options,
        value: currentSize,
        onChange: function onChange(e, _ref) {
          var value = _ref.value;
          return onValueChange(value);
        }
      });
    };

    _this.onChange = function (value) {
      if (value === _this.props.currentSize) return;

      _this.updateQuerySize(value);
    };

    _this.options = props.values;
    _this.defaultValue = props.defaultValue;
    _this.updateQuerySize = _this.props.updateQuerySize;
    _this.setInitialState = props.setInitialState;
    _this.renderElement = props.renderElement || _this._renderElement;
    return _this;
  }

  _createClass(ResultsPerPage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.currentSize === -1) {
        this.setInitialState({
          size: this.defaultValue
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          loading = _this$props.loading,
          currentSize = _this$props.currentSize,
          totalResults = _this$props.totalResults;
      return React__default.createElement(ShouldRender, {
        condition: !loading && totalResults > 0 && currentSize !== -1
      }, this.renderElement(currentSize, this.options, this.onChange));
    }
  }]);

  return ResultsPerPage;
}(React.Component);
ResultsPerPage.defaultProps = {
  defaultValue: 10,
  renderElement: null
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

var mapDispatchToProps$7 = function mapDispatchToProps(dispatch) {
  return {
    updateQuerySize: function updateQuerySize(size) {
      return dispatch(updateQueryPaginationSize(size));
    },
    setInitialState: function setInitialState$1(value) {
      return dispatch(setInitialState(value));
    }
  };
};

var ResultsPerPage$1 = connectExtended(function (state) {
  return {
    loading: state.results.loading,
    currentSize: state.query.size,
    totalResults: state.results.data.total
  };
}, mapDispatchToProps$7)(ResultsPerPage);

var SearchBar =
/*#__PURE__*/
function (_Component) {
  _inherits(SearchBar, _Component);

  function SearchBar(props) {
    var _this;

    _classCallCheck(this, SearchBar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SearchBar).call(this, props));

    _this.onInputChange = function (queryString) {
      _this.setState({
        currentValue: queryString
      });
    };

    _this.executeSearch = function () {
      _this.updateQueryString(_this.state.currentValue);
    };

    _this.updateQueryString = _this.props.updateQueryString;
    _this.state = {
      currentValue: _this.props.queryString || ''
    };
    _this.renderElement = props.renderElement || _this._renderElement;
    return _this;
  }

  _createClass(SearchBar, [{
    key: "_renderElement",
    value: function _renderElement(placeholder, queryString, onInputChange, executeSearch) {
      placeholder = placeholder || 'Type something';

      var onBtnSearchClick = function onBtnSearchClick(event, input) {
        executeSearch();
      };

      var onKeyPress = function onKeyPress(event, input) {
        if (event.key === 'Enter') {
          executeSearch();
        }
      };

      return React__default.createElement(semanticUiReact.Input, {
        action: {
          content: 'Search',
          onClick: onBtnSearchClick
        },
        fluid: true,
        placeholder: placeholder,
        onChange: function onChange(event, _ref) {
          var value = _ref.value;
          onInputChange(value);
        },
        value: queryString,
        onKeyPress: onKeyPress
      });
    }
  }, {
    key: "render",
    value: function render() {
      var placeholder = this.props.placeholder;
      return this.renderElement(placeholder, this.state.currentValue, this.onInputChange, this.executeSearch);
    }
  }]);

  return SearchBar;
}(React.Component);

SearchBar.defaultProps = {
  placeholder: '',
  queryString: '',
  renderElement: null
};

var SearchBarUncontrolled = function SearchBarUncontrolled(props) {
  return React__default.createElement(SearchBar, Object.assign({
    key: props.queryString
  }, props));
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

var mapDispatchToProps$8 = function mapDispatchToProps(dispatch) {
  return {
    updateQueryString: function updateQueryString$1(query) {
      return dispatch(updateQueryString(query));
    }
  };
};

var SearchBar$1 = connectExtended(function (state) {
  return {
    queryString: state.query.queryString
  };
}, mapDispatchToProps$8)(SearchBarUncontrolled);

var Sort =
/*#__PURE__*/
function (_Component) {
  _inherits(Sort, _Component);

  function Sort(props) {
    var _this;

    _classCallCheck(this, Sort);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Sort).call(this, props));

    _this._computeValue = function (sortBy, sortOrder) {
      return "".concat(sortBy, "-").concat(sortOrder);
    };

    _this._renderElement = function (currentSortBy, currentSortOrder, options, onValueChange) {
      var selected = _this._computeValue(currentSortBy, currentSortOrder);

      var _options = options.map(function (element, index) {
        return {
          key: index,
          text: element.text,
          value: element.value
        };
      });

      return React__default.createElement(semanticUiReact.Dropdown, {
        selection: true,
        compact: true,
        options: _options,
        value: selected,
        onChange: function onChange(e, _ref) {
          var value = _ref.value;
          return onValueChange(value);
        }
      });
    };

    _this.onChange = function (value) {
      if (value === _this._computeValue(_this.props.currentSortBy, _this.props.currentSortOrder)) return;

      var selected = _this.options.find(function (option) {
        return option.value === value;
      });

      _this.updateQuerySorting(selected.sortBy, selected.sortOrder);
    };

    _this.options = props.values;
    _this.updateQuerySorting = props.updateQuerySorting;
    _this.setInitialState = props.setInitialState;
    _this.renderElement = props.renderElement || _this._renderElement;

    _this.options.forEach(function (option) {
      return option['value'] = _this._computeValue(option.sortBy, option.sortOrder);
    }); // compute default value for sort field and sort order


    var defaultValue = _this.options.find(function (option) {
      return 'default' in option && option.default;
    });

    _this.defaultValue = {
      sortBy: defaultValue.sortBy || _this.options[0].sortBy,
      sortOrder: defaultValue.sortOrder || _this.options[0].sortOrder
    };

    var defaultValueOnEmptyString = _this.options.find(function (option) {
      return 'defaultOnEmptyString' in option && option.defaultOnEmptyString;
    });

    _this.defaultValueOnEmptyString = {
      sortBy: defaultValueOnEmptyString ? defaultValueOnEmptyString.sortBy : _this.options[0].sortBy,
      sortOrder: defaultValueOnEmptyString ? defaultValueOnEmptyString.sortOrder : _this.options[0].sortOrder
    };
    return _this;
  }

  _createClass(Sort, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.currentSortBy === null && this.props.currentSortOrder === null) {
        var defaultValue = this.props.currentQueryString ? this.defaultValue : this.defaultValueOnEmptyString;
        this.setInitialState({
          sortBy: defaultValue.sortBy,
          sortOrder: defaultValue.sortOrder
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          currentSortBy = _this$props.currentSortBy,
          currentSortOrder = _this$props.currentSortOrder,
          loading = _this$props.loading,
          totalResults = _this$props.totalResults;
      return React__default.createElement(ShouldRender, {
        condition: currentSortBy !== null && currentSortOrder !== null && !loading && totalResults > 0
      }, this.renderElement(currentSortBy, currentSortOrder, this.options, this.onChange));
    }
  }]);

  return Sort;
}(React.Component);
Sort.defaultProps = {
  currentSortBy: null,
  currentSortOrder: null,
  renderElement: null
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

var mapDispatchToProps$9 = function mapDispatchToProps(dispatch) {
  return {
    updateQuerySorting: function updateQuerySorting$1(sortBy, sortOrder) {
      return dispatch(updateQuerySorting(sortBy, sortOrder));
    },
    setInitialState: function setInitialState$1(value) {
      return dispatch(setInitialState(value));
    }
  };
};

var Sort$1 = connectExtended(function (state) {
  return {
    currentQueryString: state.query.queryString,
    currentSortBy: state.query.sortBy,
    currentSortOrder: state.query.sortOrder,
    loading: state.results.loading,
    totalResults: state.results.data.total
  };
}, mapDispatchToProps$9)(Sort);

var SortBy =
/*#__PURE__*/
function (_Component) {
  _inherits(SortBy, _Component);

  function SortBy(props) {
    var _this;

    _classCallCheck(this, SortBy);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SortBy).call(this, props));

    _this._renderElement = function (currentSortBy, options, onValueChange) {
      var _options = options.map(function (element, index) {
        return {
          key: index,
          text: element.text,
          value: element.value
        };
      });

      return React__default.createElement(semanticUiReact.Dropdown, {
        selection: true,
        compact: true,
        options: _options,
        value: currentSortBy,
        onChange: function onChange(e, _ref) {
          var value = _ref.value;
          return onValueChange(value);
        }
      });
    };

    _this.onChange = function (value) {
      if (value === _this.props.currentSortBy) return;

      _this.updateQuerySortBy(value);
    };

    _this.options = props.values;
    _this.defaultValue = _this.props.defaultValue;
    _this.defaultValueOnEmptyString = _this.props.defaultValueOnEmptyString;
    _this.updateQuerySortBy = props.updateQuerySortBy;
    _this.setInitialState = props.setInitialState;
    _this.renderElement = props.renderElement || _this._renderElement;
    return _this;
  }

  _createClass(SortBy, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.currentSortBy === null) {
        var sortBy = this.props.currentQueryString ? this.defaultValue : this.defaultValueOnEmptyString || this.defaultValue;
        this.setInitialState({
          sortBy: sortBy
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          currentSortBy = _this$props.currentSortBy,
          loading = _this$props.loading,
          totalResults = _this$props.totalResults;
      return React__default.createElement(ShouldRender, {
        condition: currentSortBy !== null && !loading && totalResults > 0
      }, this.renderElement(currentSortBy, this.options, this.onChange));
    }
  }]);

  return SortBy;
}(React.Component);
SortBy.defaultProps = {
  defaultValueOnEmptyString: null,
  currentSortBy: null,
  renderElement: null
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

var mapDispatchToProps$a = function mapDispatchToProps(dispatch) {
  return {
    updateQuerySortBy: function updateQuerySortBy$1(sortByValue) {
      return dispatch(updateQuerySortBy(sortByValue));
    },
    setInitialState: function setInitialState$1(value) {
      return dispatch(setInitialState(value));
    }
  };
};

var SortBy$1 = connectExtended(function (state) {
  return {
    loading: state.results.loading,
    totalResults: state.results.data.total,
    currentSortBy: state.query.sortBy,
    currentQueryString: state.query.queryString
  };
}, mapDispatchToProps$a)(SortBy);

var SortOrder =
/*#__PURE__*/
function (_Component) {
  _inherits(SortOrder, _Component);

  function SortOrder(props) {
    var _this;

    _classCallCheck(this, SortOrder);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SortOrder).call(this, props));

    _this._renderElement = function (currentSortOrder, options, onValueChange) {
      var _options = options.map(function (element, index) {
        return {
          key: index,
          text: element.text,
          value: element.value
        };
      });

      return React__default.createElement(semanticUiReact.Dropdown, {
        selection: true,
        compact: true,
        options: _options,
        value: currentSortOrder,
        onChange: function onChange(e, _ref) {
          var value = _ref.value;
          return onValueChange(value);
        }
      });
    };

    _this.onChange = function (value) {
      if (value === _this.props.currentSortOrder) return;

      _this.updateQuerySortOrder(value);
    };

    _this.options = props.values;
    _this.defaultValue = _this.props.defaultValue;
    _this.updateQuerySortOrder = props.updateQuerySortOrder;
    _this.setInitialState = props.setInitialState;
    _this.renderElement = props.renderElement || _this._renderElement;
    return _this;
  }

  _createClass(SortOrder, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.currentSortOrder === null) {
        this.setInitialState({
          sortOrder: this.defaultValue
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          currentSortOrder = _this$props.currentSortOrder,
          loading = _this$props.loading,
          totalResults = _this$props.totalResults;
      return React__default.createElement(ShouldRender, {
        condition: currentSortOrder !== null && !loading && totalResults > 0
      }, this.renderElement(currentSortOrder, this.options, this.onChange));
    }
  }]);

  return SortOrder;
}(React.Component);
SortOrder.defaultProps = {
  currentSortOrder: null,
  renderElement: null
};

/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

var mapDispatchToProps$b = function mapDispatchToProps(dispatch) {
  return {
    updateQuerySortOrder: function updateQuerySortOrder$1(sortOrderValue) {
      return dispatch(updateQuerySortOrder(sortOrderValue));
    },
    setInitialState: function setInitialState$1(value) {
      return dispatch(setInitialState(value));
    }
  };
};

var SortOrder$1 = connectExtended(function (state) {
  return {
    loading: state.results.loading,
    totalResults: state.results.data.total,
    currentSortOrder: state.query.sortOrder
  };
}, mapDispatchToProps$b)(SortOrder);

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function withState(Component) {
  var WrappedComponent = function WrappedComponent(_ref) {
    var dispatch = _ref.dispatch,
        props = _objectWithoutProperties(_ref, ["dispatch"]);

    return React__default.createElement(Component, props);
  };

  var mapStateToProps = function mapStateToProps(state) {
    return {
      currentQueryState: state.query,
      currentResultsState: state.results
    };
  };

  return connectExtended(mapStateToProps, null)(WrappedComponent);
}

var onQueryChanged = function onQueryChanged(payload) {
  var evt = new CustomEvent('queryChanged', {
    detail: payload
  });
  console.log(payload.search_query);
  window.dispatchEvent(evt);
};

exports.ActiveFilters = ActiveFilters$1;
exports.AutocompleteSearchBar = AutocompleteSearchBar$1;
exports.BucketAggregation = BucketAggregation$1;
exports.Count = Count$1;
exports.ESRequestSerializer = ESRequestSerializer;
exports.ESResponseSerializer = ESResponseSerializer;
exports.ESSearchApi = ESSearchApi;
exports.EmptyResults = EmptyResults$1;
exports.Error = Error$2;
exports.InvenioRequestSerializer = InvenioRequestSerializer;
exports.InvenioResponseSerializer = InvenioResponseSerializer;
exports.InvenioSearchApi = InvenioSearchApi;
exports.InvenioSuggestionApi = InvenioSuggestionApi;
exports.LayoutSwitcher = LayoutSwitcher$1;
exports.Pagination = Pagination$1;
exports.ReactSearchKit = ReactSearchKit;
exports.ResultsGrid = ResultsGrid$1;
exports.ResultsList = ResultsList$1;
exports.ResultsLoader = ResultsLoader$1;
exports.ResultsMultiLayout = ResultsMultiLayout$1;
exports.ResultsPerPage = ResultsPerPage$1;
exports.SearchBar = SearchBar$1;
exports.Sort = Sort$1;
exports.SortBy = SortBy$1;
exports.SortOrder = SortOrder$1;
exports.UrlHandlerApi = UrlHandlerApi;
exports.configureStore = configureStore;
exports.connect = connectExtended;
exports.onQueryChanged = onQueryChanged;
exports.withState = withState;
//# sourceMappingURL=index.js.map
