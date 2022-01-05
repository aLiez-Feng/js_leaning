// 面向对象写法 （涉及到业务逻辑的代码，面向对象非常擅长组织逻辑）
function CalcNumber(number) {
  this.number = number;
}

CalcNumber.prototype.calc = function () {
  return this.number * 2 - 1;
};

let CalcNumber_class = new CalcNumber(10);
let newNumber = CalcNumber_class.calc();
console.log(newNumber);

// 面向对象扩展子类
function CalcNumberSon(number) {
  CalcNumber.call(this, number);
}

CalcNumberSon.prototype = new CalcNumber();
CalcNumberSon.prototype.calc = function () {
  return this.number * 2 - 1 + 2;
};

let CalcNumber_class_son = new CalcNumberSon(10);
let newNumber_son = CalcNumber_class_son.calc();
console.log(newNumber_son);

// 函数式编程
function multiplyTwo(num) {
  return num * 2;
}

function minusOne(num) {
  return num - 1;
}

// 函数式编程扩展
function addTwo(num) {
  return num + 2;
}

var Num = multiplyTwo(10);
let newnum = minusOne(Num);
newnum = addTwo(newnum);

console.log(newnum);
