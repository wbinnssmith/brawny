# Brawny: A friendly-faced logger.

Brawny is a generic logging frontend with a set of pluggable backends, for
node and the browser.  It's intended to be far simpler (but is certainly
inspired by) than other logging solutions, like
[winston](https://github.com/winstonjs/winston) or
[bunyan](https://github.com/trentm/node-bunyan).

## Installation

Simply `npm install brawny`.

## API

Brawny is distributed as a UMD module, so you can:

* `require('brawny')` in browserify, webpack, node, or iojs
* require brawny as an AMD module
* simply drop `brawny.js` in a script tag and it will be exposed as
  `window.brawny`

Here's an example:

     var brawny = require('brawny'); var brawnyConsole =
     require('brawny/lib/transports/console');

     brawny.use(brawnyConsole);

     brawny.log('this will be sent to console.log'); brawny.error('this will
     be sent to console.log'); brawny.warn('this will be sent to
     console.log');

Brawny uses different "transports" for its various backends. A transport is a
simple function that receives your log message and optional metadata and log
level, and then logs the message on your behalf.  Logs are processed
asynchronously (this is a nice common denominator for transports that send
data via xhr, etc.), and you can optionally be notified when your message has
been logged.

brawny comes with a basic console backend, but is made with extensibility in
mind. Imagine sending logs to an HTTP endpoint, or your favorite error
reporting service.
