// 以下为非纯函数
var tempNum = 10;

function add(num) {
  return tempNum + num;
}

// 在调用之前，全局变量tempNum 可能会改变，所以不是纯函数
console.log(add(3));

// 如果需要更改为纯函数的写法
function add_fn(num1, num2) {
  return num1 + num2;
}

console.log(add_fn(3, 4));

// 函数副作用
var a = 100;
function aPlus() {
  // 此时该函数被调用时，会改变全局a变量存储的值 -》 即为函数副作用
  a += 1;
  return a;
}

// 简易情况下值需要将a设置为函数的参数传递进去以后，即可消除函数副作用
function aPlus2(a) {
  a += 1;
  return a;
}

// 如果需要消除对象的函数副作用 ---
var obj = {
  obja: 1000,
};
function objFn(obj) {
  // 拷贝外部对象(非一定要使用Object.create，也可以自定义一个拷贝方法)
  let _createObj = Object.create(obj);
  _createObj.obja += 1;
  return _createObj;
}
let newV = objFn(obj);
console.log("原始obj", obj.obja);
console.log(newV);

// 如果需要消除数组的函数副作用 ---

var arr = [1, 2, 3, 4];
function arrFn(arr) {
  // 使用展开运算符，来消除副作用(非一定要使用展开运算符，也可以自定义一个for in循环)
  let _newArr = [...arr];
  _newArr[0] += 1;
  return _newArr;
}

let newArr = arrFn(arr);
console.log(newArr);
console.log("原始arr：", arr);



