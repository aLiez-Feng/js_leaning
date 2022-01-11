function* gen(x) {
  let y = yield x + 2; //yield划分为第一阶段
  return y; // yield划分为第二阶段
}

let newGen = gen(1);
// generator函数返回的是一个指针对象

// generator函数不会执行内部代码，若要执行必须调用 next() 方法
// 当调用了next方法就会执行generator函数的指针
console.log(newGen.next()); // {value:3,done,false} 执行let y = yield x + 2;（第一阶段）
// done为false则表示阶段未完全执行完
console.log(newGen.next(2)); // {value:undefined,done:true} 执行 return y; （第二阶段）
// 为什么此处value会为undefined
// 由于next调用取的值是gen传入的实参由于第二次没有传入参数则为undefined
// done为true ，则表示generator所有阶段都执行完毕

function* gen2(x) {
  try {
    var y = yield x + 2;
  } catch (e) {
    console.log(e); // "错误!"
  }
  return y;
}

let newGen2 = gen2(1);

console.log(newGen2.next()); //{done:false,value}
newGen2.throw("错误！");

// 异步任务封装
var fetch = require("node-fetch");

function* request_gen() {
  var url = "http://xxxxx.com";
  var result = yield fetch(url); //返回的是一个Promise对象
  console.log(result.xxx);
}

var g = request_gen(); //request_gen调用generator函数获取指针
var result = g.next(); //执行第一阶段，返回对象

result.value // 获取Promise对象
  .then(function (data) {
    //调用then方法 获取data
    return data.json(); // 转换为json
  })
  .then(function (data) {
    g.next(data); //data作为第一阶段的返回值传入到 console.log(result.xxx);
  });
