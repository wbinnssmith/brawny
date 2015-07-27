import Raven from 'raven-js';
import brawny from '../src/';
import brawnyRaven from '../src/transports/raven';
import brawnyConsole from '../src/transports/console';
import brawnyDebug from '../src/transports/debug';
import http from '../src/transports/http';
import debug from 'debug';

window.debug = debug;

window.brawny = brawny;
window.Raven = Raven;

Raven.config('http://bbb1bcdb2f344c17b062892a6f37598e@192.168.50.2:9000/2').install();
brawny.use(brawnyDebug());
brawny.use(brawnyRaven(Raven));
brawny.use(brawnyConsole);
brawny.use(http('http://localhost:3000/events/foo'));

brawny.log('yolo');

var called = 0;
function testError() {
  throw new Error(`error thrown ${called++} times`);
}

window.testError = testError;

testError();
testError();
testError();
testError();
testError();
