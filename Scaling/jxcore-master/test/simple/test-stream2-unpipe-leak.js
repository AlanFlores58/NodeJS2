// Copyright & License details are available under JXCORE_LICENSE file



var common = require('../common.js');
var assert = require('assert');
var stream = require('stream');

var chunk = new Buffer('hallo');

var util = require('util');

function TestWriter() {
  stream.Writable.call(this);
}
util.inherits(TestWriter, stream.Writable);

TestWriter.prototype._write = function(buffer, encoding, callback) {
  callback(null);
};

var dest = new TestWriter();

// Set this high so that we'd trigger a nextTick warning
// and/or RangeError if we do maybeReadMore wrong.
function TestReader() {
  stream.Readable.call(this, { highWaterMark: 0x10000 });
}
util.inherits(TestReader, stream.Readable);

TestReader.prototype._read = function(size) {
  this.push(chunk);
};

var src = new TestReader();

for (var i = 0; i < 10; i++) {
  src.pipe(dest);
  src.unpipe(dest);
}

assert.equal(src.listeners('end').length, 0);
assert.equal(src.listeners('readable').length, 0);

assert.equal(dest.listeners('unpipe').length, 0);
assert.equal(dest.listeners('drain').length, 0);
assert.equal(dest.listeners('error').length, 0);
assert.equal(dest.listeners('close').length, 0);
assert.equal(dest.listeners('finish').length, 0);

console.error(src._readableState);
process.on('exit', function() {
  assert(src._readableState.length >= src._readableState.highWaterMark);
  src._readableState.buffer.length = 0;
  console.error(src._readableState);
});