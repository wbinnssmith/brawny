export default function console_(level, msg, meta, cb) {
  console[level](msg);
  return cb();
}
