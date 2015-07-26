# Brawny: A friendly-faced logger.

Brawny is a generic logging frontend with a set of pluggable backends, for
node and the browser.  It's intended to be far simpler (but is certainly
inspired by) than other logging solutions, like
[winston](https://github.com/winstonjs/winston) or
[bunyan](https://github.com/trentm/node-bunyan).

## Installation

Simply `npm install brawny`.

## API

install with npm and then:

* `require('brawny')` in browserify, webpack, node, or iojs

Here's an example:

```javascript
var brawny = require('brawny');
var brawnyConsole = require('brawny/lib/transports/console');

brawny.use(brawnyConsole);

brawny.log('this will be sent to console.log');
brawny.error('this will be sent to console.error');
brawny.warn('this will be sent to console.warn');
```

Brawny uses different "transports" for its various backends. A transport is a
simple function that receives your log message and optional metadata and log
level, and then logs the message on your behalf.  Logs are processed
asynchronously (this is a nice common denominator for transports that send
data via xhr, etc.), and you can optionally be notified when your message has
been logged.

brawny comes with a basic console backend, but is made with extensibility in
mind. Imagine sending logs to an HTTP endpoint, or your favorite error
reporting service.

<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dt>
<h4 class="name" id="Logger"><span class="type-signature"></span>new Logger<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<dl class="details">
<h5 class="subsection-title">Properties:</h5>
<dl>
<table class="props">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>level</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>The minimum level messages must be to be logged by this logger.</p></td>
</tr>
</tbody>
</table></dl>
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/wbinnssmith/brawny/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/wbinnssmith/brawny/blob/master/index.js#L37">lineno 37</a>
</li>
</ul></dd>
</dl>
</dd>
</div>
<dl>
<dt>
<h4 class="name" id="error"><span class="type-signature"></span>error<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Alais for <code>error()</code></p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/wbinnssmith/brawny/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/wbinnssmith/brawny/blob/master/index.js#L266">lineno 266</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="log"><span class="type-signature"></span>log<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Shortcut for <code>log('debug', ...)</code></p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/wbinnssmith/brawny/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/wbinnssmith/brawny/blob/master/index.js#L218">lineno 218</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="log"><span class="type-signature"></span>log<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Shortcut for <code>log('info', ...)</code></p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/wbinnssmith/brawny/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/wbinnssmith/brawny/blob/master/index.js#L231">lineno 231</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="log"><span class="type-signature"></span>log<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Shortcut for <code>log('warn', ...)</code></p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/wbinnssmith/brawny/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/wbinnssmith/brawny/blob/master/index.js#L244">lineno 244</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="log"><span class="type-signature"></span>log<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Shortcut for <code>log('error', ...)</code></p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/wbinnssmith/brawny/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/wbinnssmith/brawny/blob/master/index.js#L257">lineno 257</a>
</li>
</ul></dd>
</dl>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
