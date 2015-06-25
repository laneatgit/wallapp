"use strict";

var Primus = require('primus');
console.log("Primus");
module.exports = function startPrimus(server, opts) {
  opts = opts || {};
  console.log("starting primus");
  var primus = new Primus(server, {
    transformer: opts.transformer || 'websockets',
    parser: opts.parser || 'json',
    pathname: opts.pathname || '/primus'
  });

  return function broadcast(msg) {
    primus.write(msg);
  };
};
