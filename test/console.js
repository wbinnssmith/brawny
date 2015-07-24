import test from 'tape';
import sinon from 'sinon';
import brawny from '../src';
import console_ from '../src/transports/console';

test('logger shorthand methods use the appropriate level', (t) => {
  const levels = ['info', 'warn', 'error'];
  t.plan(levels.length);

  const logger = new brawny.Logger();

  const transport = console_;

  logger.use(transport);
  logger.level = 'debug';

  levels.forEach((level) => {
    var spy = sinon.spy(console, level);
    logger[level]('foobar', () => {
      t.ok(spy.calledWith('foobar'), `level shorthand ${level} calls log with level ${level}`);
      spy.restore();
    })
  })
});
