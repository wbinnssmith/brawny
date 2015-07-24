import test from 'tape';
import sinon from 'sinon';
import brawny from '../src';

test('constructing brawny with new', (t) => {
  t.plan(1);

  var logger = new brawny.Logger();
  t.ok(logger instanceof brawny.Logger);
});

test('creating a default logger on import', (t) => {
  t.plan(2);

  var logger = brawny;
  t.ok(brawny instanceof brawny.Logger, 'brawny is a logger (the default) itself');
  t.ok(brawny.level === 'info', 'default logger has level of info');
})

test('logging a basic message', (t) => {
  t.plan(1);

  const logger = new brawny.Logger();

  const transport = sinon.stub();
  transport.callsArg(3);
  logger.use(transport);

  logger.log('foobar', () => {
    t.ok(transport.calledWith('info'));
  });
});

test('not logging when its level masks it', (t) => {
  t.plan(1);

  const logger = new brawny.Logger({level: 'error'});

  const transport = sinon.stub();
  transport.callsArg(3);
  logger.use(transport);

  logger.log('foobar', () => {
    t.notOk(transport.called);
  });
});

test('logger shorthand methods use the appropriate level', (t) => {
  const levels = ['debug', 'info', 'warn', 'error'];
  t.plan(levels.length);

  const logger = new brawny.Logger();

  const transport = sinon.stub();
  transport.callsArg(3);

  logger.use(transport);
  logger.level = 'debug';

  levels.forEach((level) => {
    logger[level]('foobar', () => {
      t.ok(transport.calledWith(level, 'foobar'), `level shorthand ${level} calls log with level ${level}`);
    })
  })
});
