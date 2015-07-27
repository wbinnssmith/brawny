import Transport from './transport';
import toFactory from 'to-factory';

class RavenTransport extends Transport {
  get name() {
    return 'raven';
  }

  constructor(Raven, opts={}) {
    super();
    this.level = opts.level || 'error';
    this.raven = Raven;
  }

  log(level, msg, meta, done) {
    if (level === 'error') {
      this.raven.captureException(msg, meta);
    } else {
      this.raven.captureMessage(msg, meta);
    }

    super.log(level, msg, meta, done);
  }
}

export default toFactory(RavenTransport);
