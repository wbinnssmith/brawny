import Transport from './transport';
import toFactory from 'to-factory';
import throttle from 'lodash.throttle';
import nets from 'nets';
import extend from 'xtend';

class HTTPTransport extends Transport {
  get name() {
    return 'http';
  }

  constructor(endpoint, opts={}) {
    super();
    this.level = opts.level || 'info';
    this.endpoint = endpoint;
    this.headers = extend({}, opts.headers, {
      'Content-Type': 'application/json'
    });

    this._queue = [];
    this._cbQueue = [];

    // Limit sending logs to once every 5s by default
    const rate = opts.rate || 5 * 1000;
    this.throttledSend = throttle(this.send.bind(this), rate);
  }

  log(level, msg, meta, done) {
    this._queue.unshift({
      level,
      msg: msg.message || msg,
      meta
    });
    this._cbQueue.unshift(done);

    this.throttledSend();
  }

  send() {
    // Copy the list of callbacks so we can notify their
    // listeners when complete
    const frozenQueue = this._cbQueue.slice();
    nets({
      url: this.endpoint,
      method: 'POST',
      body: JSON.stringify({
        events: this._queue
      }),
      headers: this.headers
    }, (err, resp) => {
      frozenQueue.forEach(function (done) {
        done(err, resp)
      });
    });

    // Immediately flush both queues so errors don't duplicate.
    this._queue = [];
    this._cbQueue = [];
  }
}

export default toFactory(HTTPTransport);
