# Brawny: A friendly-faced logger.

Brawny is a generic logging frontend with a set of pluggable backends, for
node and the browser.  It's intended to be far simpler (but is certainly
inspired by) than other logging solutions, like
[winston](https://github.com/winstonjs/winston) or
[bunyan](https://github.com/trentm/node-bunyan).

Brawny uses different "transports" for its various backends. A transport is a
plugin that receives your log message and optional metadata and log
level, and then logs the message on your behalf.  Logs are processed
asynchronously (this is a nice common denominator for transports that send
data via xhr, etc.), and you can optionally be notified when your message has
been logged.

brawny comes with a many backends, including a basic console backend, but is made with extensibility in
mind. Imagine sending logs to an HTTP endpoint, or directly to your favorite error
reporting service.

Here's a quick example:

```javascript
var brawny = require('brawny');
var console_ = require('brawny/lib/transports/console');

brawny.use(console_);

brawny.log('this will be sent to console.log');
brawny.error('this will be sent to console.error');
brawny.warn('this will be sent to console.warn');
```

## Installation

Simply `npm install brawny`.

## API

install with npm and then:

`var brawny = require('brawny')` in browserify, webpack, node, or iojs

requiring brawny yields a default logger with a factory attached to create additional loggers.

### `brawny.create('myapp', opts={level: 'info'})`

Creates a new brawny logger with the specified name. `opts` defaults to using
a logger level of info.

### `brawny.level`

Public property representing the logger's level. Change this to alter the logger's verbosity.

### `brawny.use(transport)`

Add a transport plugin to this logger. Any log messages that meet this logger's
level will be forwarded to all transports.

### `brawny.log(level, msg, meta, done)`

Send a JSON-stringifyable message `msg` to all of this logger's transports if the message's loglevel exceeds both
the logger's level and the transport's level. For instance, if a `warn` message is sent to a logger
with level `info` with two transports in use, one with a `warn` level and the other with an `error`
level, the message will only be sent to the `warn` transport.

It is highly recommended to send an `Error` object as the message when invoking `brawny.error()`. This way,
transports that report exceptions can send along a stacktrace of where the error occurred.

Metadata `meta` will be sent to each transport, and it is up to the transport to use it.

Asynchronously calls callback `done` once all relevant transports have completed logging.

### `brawny.try(toTry, meta, done)`

Immediately calls the provided function `toTry` in a `try...catch` and send any errors to this logger's
`error()` handler. `toTry` may also be a Promise, where its rejection would be handled by the `error()` handler
as well. Additionally, if `toTry` is a function that returns a Promise, that promise's rejection will also be
handled.

Be sure to use Function.prototype.bind if you intend to maintain function context.

*All thrown exceptions and promise rejections are re-raised!*

Asynchronously calls callback `done` once all relevant transports have completed logging.
*`done()` will not be invoked if no error ocurred.*

### `brawny.wrap(fn, meta, done)`

Wraps the provided function by returning a new function wrapped in `try()`
Be sure to use Function.prototype.bind if you intend to maintain function context.

### `brawny.debug()` / `brawny.info()` / `brawny.warn()` / `brawny.error()`
These are all shortcuts for `brawny.log(level, ...)` for their respective log levels.

### `brawny.exception()`
Alias for `brawny.error()`
