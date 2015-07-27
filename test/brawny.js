import Promise from 'bluebird';
import brawny from '../src';
import sinon from 'sinon';
import test from 'tape';

function getStubbedLogger(logLevel='info', transportLevel='debug') {
  const logger = brawny.create('basic');
  logger.level = logLevel;

  const transport = {
    name: 'stubbed',
    level: transportLevel,
    log: sinon.stub()
  }
  transport.log.callsArgAsync(3);
  logger.use(transport);

  return {logger, transport};
}

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

test('logging a basic string message', (t) => {
  t.plan(1);

  const {logger, transport} = getStubbedLogger();
  logger.log('foobar', () => {
    t.ok(transport.log.calledWith('info'));
  });
});

test('logging an object', (t) => {
  t.plan(1);

  const {logger, transport} = getStubbedLogger();

  const obj = {foo: 'bar'}
  logger.log(obj, () => {
    t.ok(transport.log.calledWith('info', obj));
  });
});

test('emitting \'log\' with the level when logging finishes', (t) => {
  t.plan(1);
  const {logger, transport} = getStubbedLogger();
  const handler = sinon.spy();

  logger.on('log', handler);

  logger.warn('foobar', () => {
    t.ok(handler.calledWith('warn', 'foobar'));
  })
})

test('emitting \'log:${level}\' with the level when logging finishes', (t) => {
  t.plan(1);
  const {logger, transport} = getStubbedLogger();
  const handler = sinon.spy();

  logger.on('log:warn', handler);

  logger.warn('foobar', () => {
    t.ok(handler.calledWith('foobar'));
  })
})

test('not logging when the logger\'s level masks it', (t) => {
  t.plan(1);

  const {logger, transport} = getStubbedLogger('error');

  logger.log('foobar', () => {
    t.notOk(transport.log.called);
  });
});

test('not logging when the transport\'s level masks it', (t) => {
  t.plan(1);

  const {logger, transport} = getStubbedLogger('info', 'error');

  logger.log('foobar', () => {
    t.notOk(transport.log.called);
  });
});

test('logger shorthand methods use the appropriate level', (t) => {
  const levels = ['debug', 'info', 'warn', 'error'];
  t.plan(levels.length);

  const {logger, transport} = getStubbedLogger('debug');

  levels.forEach((level) => {
    logger[level]('foobar', () => {
      t.ok(transport.log.calledWith(level, 'foobar'), `level shorthand ${level} calls log with level ${level}`);
    })
  })
});

const toThrow = new Error('oh noes!!!!');

test('brawny.try executes a given callback and calls brawny.error if an exception is thrown', (t) => {
  t.plan(2);
  const {logger, transport} = getStubbedLogger();

  t.throws(() => {
    logger.try(() => {
      throw toThrow;
      console.warn('this should not be reached...');
    }, () => {
      t.ok(transport.log.calledWith('error'), 'logger is called with error and the exception');
    });
  });
});

test('brawny.try takes optional metadata', (t) => {
  t.plan(3);

  const {logger, transport} = getStubbedLogger();
  const metadata = {user: '123'};

  t.throws(() => {
    logger.try(() => {
      throw toThrow;
      console.warn('this should not be reached...');
    }, metadata, () => {
      t.ok(transport.log.calledWith('error', toThrow), 'logger is called with error and the exception');
      t.equal(transport.log.args[0][2].user, '123')
    });
  });
})

test('brawny.try handles and reports errors thrown in promises', (t) => {
  t.plan(2);
  const {logger, transport} = getStubbedLogger();

  logger.try(Promise.reject(toThrow))
        .catch((e) => {
          t.equal(e, toThrow, 'rethrows the exception');
          t.ok(transport.log.calledWith('error', toThrow), 'calls error on the transport');
        });
})

test('brawny.try executes and handles errors in promise-returning functions', (t) => {
  t.plan(2);
  const {logger, transport} = getStubbedLogger();

  logger.try(() => {
    return Promise.reject(toThrow);
  }).catch((e) => {
    t.equal(e, toThrow, 'rethrows the exception');
    t.ok(transport.log.calledWith('error', toThrow), 'calls error on the transport');
  });
})

test('brawny.wrap returns a try-wrapped function', (t) => {
  t.plan(2);

  const {logger, transport} = getStubbedLogger();

  function thrower() {
    throw toThrow;
  }

  const wrappedThrower = logger.wrap(thrower, () => {
    t.ok(transport.log.calledWith('error', toThrow), 'calls error on the transport')
  });

  t.throws(() => {
    wrappedThrower();
  });
})

test('brawny.wrap returns a try-wrapped function with additional args', (t) => {
  t.plan(2);

  const {logger, transport} = getStubbedLogger();

  function argThrower(a1) {
    throw a1;
  }

  const wrappedThrower = logger.wrap(argThrower, () => {
    t.ok(transport.log.calledWith('error', toThrow), 'calls error on the transport')
  });

  t.throws(() => {
    wrappedThrower(toThrow);
  });
})
