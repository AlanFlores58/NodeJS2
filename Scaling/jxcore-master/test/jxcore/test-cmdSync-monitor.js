// Copyright & License details are available under JXCORE_LICENSE file


if (process.isPackaged)
  return;

var assert = require('assert'),
  jxtools = require("jxtools");

jxtools.listenForSignals();

var cmd = '"' + process.execPath + '" monitor ';

// kill monitor if it stays as dummy process
jxcore.utils.cmdSync(cmd + "stop");

process.on('exit', function (code) {
  jxcore.utils.cmdSync(cmd + 'stop');
  jxtools.rmfilesSync("*monitor*.log");
});

var arr = [
  cmd + "start",
  cmd + "stop"
];

for (var o in arr) {
  if (!arr.hasOwnProperty(o))
    continue;

  var res = jxcore.utils.cmdSync(arr[o]);
  var splited = res.out.split("\n");

  assert.ok(splited.length >= 2, "Output from running the command " + arr[o] + " is probably shorter: \n" + JSON.stringify(res, null, 4));
}