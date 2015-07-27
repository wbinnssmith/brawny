import extend from 'xtend';
import { EventEmitter } from 'events';
import isFunction from 'lodash.isfunction';
import isPromise from 'is-promise';
import forEach from 'async-each';
import levelMap from './level-map';

/**
 * @class
 * @property {string} level The minimum level messages must be to be logged by this logger.
 */
class Logger extends EventEmitter {
  /**
   * @constructor
   * @param {object} [options] Constructor options.
   * @param {string} [options.level] This logger's desired level. Must be one of
   *                                 'debug', 'info', 'warn', or 'error'. Defaults to 'info'.
   */
  constructor(name, options={}) {
    super();
    this.name = name;
    this.level = options.level || 'info';

    this._names = [];
    this._transports = {};
  }

  /**
   * Add a transport plugin to this logger. Any log messages that meet this logger's
   * level will be forwarded to all transports.
   *
   * @param {object|function} transport transport plugin that will be invoked on logging.
   * @returns {Logger} this logger object.
   */
  use(transport) {
    if (isFunction(transport)) {
      // Our external/internal api is an object, but if we get a
      // concise function, transform it
      transport = {
        name: transport.transportName || transport.name,
        log: transport
      }
    }

    this._transports[transport.name] = transport;
    this._names = Object.keys(this._transports);

    return this;
  }

  /**
   * Send a message to all of this logger's transports.
   *
   * @param {string} [level]      This message's level. Won't be logged unless it
   *                              matches or exceeds this logger's level
   *
   * @param {string|object} msg   The message to be logged. Can be a string or a JSON-stringifyable object.
   * @param {object} [meta]       Optional metadata to be sent to the logging transport.
   * @param {function} done       Asyncronous completion callback. Invoked once all logging transports have completed.
   */
  log(level, msg, meta, done) {
    if (!(level in levelMap)) {
      // assume level was left off; shift by one
      return this.log('info', level, msg, meta);
    }

    if(isFunction(meta)) {
      // assume meta was left off; shift and set empty meta
      done = meta;
    }

    const logMeta = extend({}, meta, {
      time: Date.now()
    });

    forEach(this._names, (name, next) => {
      const transport = this._transports[name];
      const transportLevel = transport.level || 'debug';

      // Only log if we're asked to log something equally or
      // more important than this Logger/Transport's level
      if (levelMap[level] >= levelMap[this.level]
          && levelMap[level] >= levelMap[transportLevel]) {
        transport.log(level, msg, logMeta, next);
      } else {
        next();
      }
    }, () => {
      this.emit('log', level, msg, meta);
      this.emit(`log:${level}`, msg, meta);
      done && done();
    });

    return this;
  }

  /**
   * Immediately calls the provided function in try... catch (or catches promise rejection)
   * and sends any errors to this logger's `error()`
   *
   * @param {function|promise} toTry    Synchronously throwing function, promise-returning function, or Promise to attempt.
   *                                    If a function, it will be invoked, and thrown exceptions or reject promises will
   *                                    have their errors sent to this logger's error-level log. If a promise, rejection error will
   *                                    be sent to the logger's error-level log. *All thrown exceptions and promise rejections are
   *                                    re-raised!*
   *
   *                                    Be sure to use Function.prototype.bind if you intend to maintain function context.
   *
   * @param {string|object} msg         The message to be logged. Can be a string or a JSON-stringifyable object.
   * @param {object} [meta]             Optional metadata to be sent to the logging transport.
   * @param {function} done             Asyncronous completion callback. Invoked once all logging transports have completed.
   */
  try(toTry, meta={}, done) {
    if(isFunction(meta)) {
      // assume meta was left off; shift and set empty meta
      done = meta;
      meta = {};
    }

    if (!isFunction(toTry) && !isPromise(toTry)) {
      console.warn('brawny.try requires either a function or a promise');
      return;
    }

    let res;
    if (isFunction(toTry)) {
      try {
        res = toTry();
      } catch (e) {
        this.error(e, meta, done);
        throw e;
      }
    } else {
      res = toTry;
    }

    if (isPromise(res)) {
      return res.then(null, (e) => {
        this.error(e, meta, done);
        throw e;
      });
    }

    return res;
  }

  /**
   * Wraps the provided function by returning a new function wrapped in `try()`
   *
   * @param {function|promise} fn       Synchronously throwing function or promise-returning function.
   *                                    Be sure to use Function.prototype.bind if you intend to maintain function context.
   *
   * @param {string|object} msg         The message to be logged. Can be a string or a JSON-stringifyable object.
   * @param {object} [meta]             Optional metadata to be sent to the logging transport.
   * @param {function} done             Asyncronous completion callback. Invoked once all logging transports have completed.
   * @returns {function}                A new function that, when invoked, will be wrapped in this logger's `try()` functionality.
   *                                    Any arguments passed to this function will be forwarded to the wrapped function.
   */
  wrap(fn, meta, done) {
    return (...args) => {
      return this.try(fn.bind(null, ...args), meta, done);
    }
  }

  /**
   * Shortcut for `log('debug', ...)`
   */
  debug(...args) {
    return this.log('debug', ...args);
  }

  /**
   * Shortcut for `log('info', ...)`
   */
  info(...args) {
    return this.log('info', ...args);
  }

  /**
   * Shortcut for `log('warn', ...)`
   */
  warn(...args) {
    return this.log('warn', ...args);
  }

  /**
   * Shortcut for `log('error', ...)`
   */
  error(...args) {
    return this.log('error', ...args);
  }

  /**
   * Alais for `error()`
   */
  exception(...args) {
    return this.error(...args);
  }
}

const brawny = new Logger('default');
brawny.Logger = Logger;
brawny.create = function(...args) {
  return new Logger(...args);
}

export default brawny;
