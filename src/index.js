import isFunction from 'lodash.isfunction';
import isString from 'lodash.isstring';
import forEach from 'async-each';

const levelMap = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
}

class Logger {
  constructor(options={}) {
    this.level = options.level || 'info';

    this._names = [];
    this._transports = {};
  }

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
  }

  log(level, msg, meta={}, done) {
    if (!isString(msg)) {
      // assume log level was left off; shift and default to info
      [msg, meta, done] = [level, msg, meta]
      level = 'info';
    }

    if(isFunction(meta)) {
      // assume meta was left off; shift and set empty meta
      done = meta;
      meta = {};
    }

    forEach(this._names, (name, next) => {
      const transport = this._transports[name];

      // Only log if we're asked to log something equally or
      // more important than this Logger's level
      if (levelMap[level] >= levelMap[this.level]) {
        transport.log(level, msg, meta, next);
      } else {
        next();
      }
    }, done);

    return this;
  }
}

Object.keys(levelMap).forEach((level) => {
  Logger.prototype[level] = function (...args) {
    return this.log(level, ...args);
  }
})

const defaultLogger = new Logger();
defaultLogger.Logger = Logger;

export default defaultLogger;
