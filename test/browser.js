import Raven from 'raven-js';
import brawny from '../';
import brawnyRaven from '../src/transports/raven';
import brawnyConsole from '../src/transports/console';

window.brawny = brawny;
window.Raven = Raven;

Raven.config('http://bbb1bcdb2f344c17b062892a6f37598e@192.168.50.2:9000/2').install();
brawny.use(new brawnyRaven(Raven));
brawny.use(brawnyConsole);

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
