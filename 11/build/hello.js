"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// const colors = require('colors/safe');
// console.log(colors.green('hello green'));
// console.log(colors.red('hello red'));
//
// console.log("Hello, Note");
var MyClass = function MyClass() {
  _classCallCheck(this, MyClass);

  var foo = 3;

  var bar = function bar(x) {
    return x * x;
  };

  console.log(bar(foo));
};

var inst = new MyClass();