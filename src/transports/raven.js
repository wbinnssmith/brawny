export default class RavenTransport {
  get name() {
    return 'raven';
  }

  constructor(Raven, opts={}) {
    this.raven = Raven;
    this.level = opts.level || 'info';
  }

  log(level, msg, meta, cb) {
    if (level === 'error') {
      this.raven.captureException(msg, meta);
    } else {
      this.raven.captureMessage(msg, meta);
    }
  }
}
