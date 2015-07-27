import Transport from './transport';
import debug from 'debug';
import toFactory from 'to-factory';

class DebugTransport extends Transport {
  get name() {
    return 'debug';
  }

  constructor(name='brawny', opts={}) {
    super(opts);

    this.level = opts.level || 'debug';
    this.debug = debug(name);
  }

  log (level, msg, meta, done) {
    super.log(level, msg, meta, done);

    if (level !== 'debug') {
      return;
    }

    this.debug(msg);
  }
}

export default toFactory(DebugTransport);
