export default function noop(level, msg, meta, cb) {
  return cb();
}
