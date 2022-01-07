function testFn(num) {
  return num;
}

console.log(Promise.resolve(1).then(testFn.bind(this, 123)));

/*
  假如testRege是一个表单校验函数
  reg: 验证规则
  value: 需要验证的值
*/
function testRege(reg, value) {}
testRege(/^[0-9*$]/, 123);
// bind函数用于柯里化操作，化简参数
// 柯里化： 一个函数需要多次调用，而参数为固定的，就用到bind去柯里化
const numberRege = testRege.bind(this, /^[0-9]*$/);
numberRege(123);

// 柯里化2
function aCurry(num1) {
  return function (num2) {
    console.log(num1, num2);
  };
}
function a(num1, num2) {}

aCurry(1)(2);

// 手写bind
Function.prototype.myBind = function (thisArg) {
  if (typeof this !== "function") {
    return;
  }
  let _self = this;
  let args = Array.prototype.slice.call(arguments, 1);
  console.log("args", args);
  return function () {
    console.log(args.concat(Array.prototype.slice.call(arguments))); //接收剩余参数，合并原来的参数
    _self.apply(thisArg, args.concat(Array.prototype.slice.call(arguments)));
  };
};

testFn.myBind(this, 1, 2, 3)(this, 111);
