// var x = 1;
// function f(m) {
//   return m * 2;
// }
// let result = f(x + 5);
// console.log(result);

// function f1(a, b) {
//   return b;
// }

// f1((5 * 6) / 7 - 8, 9);

// thunk含义
// let x = 6;
// function f2(n) {
//   return n * 2;
// }

// // 传值调用
// console.log(f2(x + 5)); // 22

// // 等同于
// let thunk = function () {
//   return x + 5;
// };
// // 传名调用
// function f3(thunk) {
//   return thunk() * 2;
// }

// console.log(f3(thunk)); // 22

var fetch = require("node-fetch");

function* gen() {
  let url = "https://api.github.com/users/Wangyi-max";
  let result = yield fetch(url);
  console.log(result.bio);
}

let g = gen();
let result = g.next();

// 一次请求
result.value
  .then(function (data) {
    return data.json();
  })
  .then(function (data) {
    g.next(data);
  });

// 该generator函数如果在多次调用的时候，需要多次调用result.value.then()
// 需要封装一个自动自行器

// 自动执行器
function run(gen) {
  let g = gen();
  function next(data) {
    let result = (result = g.next());
    if (result.done) return result.value;
    // 如果generator函数还有剩余阶段，则继续递归调用传入参数
    result.value
      .then(function (data) {
        return data.json();
      })
      .then(function (data) {
        next(data);
      });
  }
  next();
}

run(gen);
