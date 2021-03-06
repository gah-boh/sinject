function SInject() {
  var objMap = {}; // Would use a Map in ES6 so token can be anything
  var registered = [];
  var debug = false;
  var bootstrapped = false;

  function enableDebugging() {
    debug = true;
  }

  function getObject(token) {
    if (debug && bootstrapped) {
      if (!objMap.hasOwnProperty(token)) {
        console.warn('Token `' + token + '` was requested, but was never provided.');
      }
    }
    return objMap[token];
  }

  function provide(token, obj) {
    if (debug && objMap.hasOwnProperty(token)) {
      console.warn('Token `' + token + '` is being re-defined, from `' + objMap[token] + '` to `' + obj + '`.');
    }
    objMap[token] = obj;
  }

  function inject(fn/*, tokens */) {
    var tokens = [].slice.call(arguments, 1);
    var fnDescription = {tokens: tokens, fn: fn};
    if (bootstrapped) {
      performInject(fnDescription);
    } else {
      registered.push(fnDescription);
    }
  }

  function register(token, obj, fn/*, tokens */) {
    var tokens = [].slice.call(arguments, 3);
    provide(token, obj);
    inject(fn, tokens);
  }

  function performInject(fnDescription) {
    fnDescription.fn.apply(undefined, fnDescription.tokens && fnDescription.tokens.map(getObject));
  }

  function bootstrap() {
    registered.forEach(performInject);
    registered = [];
    bootstrapped = true;
  }

  return exports = {
    provide:         provide,
    inject:          inject,
    register:        register,
    bootstrap:       bootstrap,
    enableDebugging: enableDebugging
  };
}

var instance = new SInject();
instance.createNew = function() {
  return new SInject();
};

module.exports = instance;