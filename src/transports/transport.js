import nextTick from 'breeze-nexttick';

export default class Transport {
  get name() {
    return 'transport';
  }

  constructor(opts={}) {
    this.level = opts.level || 'info';
  }

  log(level, msg, meta, done) {
    if (done) {
      nextTick(done);
    }
  }
}
