// const fs = require("fs");

// // 使用generator函数
// const readFile = function (fileName) {
//   return new Promise(function (resolve, reject) {
//     fs.readFile(fileName, function (error, data) {
//       if (error) return reject(error);
//       console.log(data);
//       resolve(data);
//     });
//   });
// };

// const gen = function* () {
//   const f1 = yield readFile("./1、理解异步.md");
//   const f2 = yield readFile("./2.事件循环.md");

//   console.log(f1);
//   console.log(f2);
// };

// // 使用async/await

// const readFile1 = function (fileName) {
//   return new Promise(function (resolve, reject) {
//     fs.readFile(fileName, function (error, data) {
//       if (error) return reject(error);
//       console.log(data);
//       resolve(data);
//     });
//   });
// };

// const asycnReadFile = async function () {
//   const f1 = await readFile1("./1、理解异步.md");
//   const f2 = await readFile1("./2.事件循环.md");

//   console.log(f1);
//   console.log(f2);
// };

// asycnReadFile();

// // async 的基本用法

// async function f() {
//   return "test";
// }

// f();

// f().then((res) => {
//   console.log(res);
// });

// async function f1() {
//   throw new Error("出错了！");
// }

// // async 错处处理！
// f1().then(
//   (res) => {
//     console.log(res);
//   },
//   (error) => {
//     console.log(error);
//   }
// );

// // await命令

// async function fff() {
//   // return 123;
//   // 等同于
//   return await 123;
// }

// fff().then((res) => {
//   console.log(res); // 123
// });

// 线程睡眠

function sleep(delay, i) {
  console.log(i);
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

// async await 会使线程休眠，每隔一秒打印 i
// 如果去掉async和 await 则会瞬间打印12345
async function one2FiveInAsync() {
  for (let i = 0; i <= 5; i++) {
    // await 语句会阻塞 后面的sleep异步操作的执行（线程睡眠）等待异步操作完成以后再执行后面的操作
    await sleep(1000, i);
  }
}
one2FiveInAsync();

async function fffff() {
  // try catch可以让程序继续执行
  try {
    await Promise.reject("中断代码执行！");
  } catch (error) {}
  await Promise.resolve("111");
}
async function fffff() {
  await Promise.reject("中断代码执行！").catch((e) => {
    return Promise.resolve("111");
  });
}
async function fffff() {
  try {
    const f1 = await firstStep();
    const f2 = await secondStep();
    const f3 = await thirdStep();
    console.log("final:", f3);
  } catch (error) {
    console.log(error);
  }
}

fffff().then((res) => {
  console.log(res);
});

// 如果多个异步操作不是继发进行的，最好让此代码同时触发 以减少异步操作的时间
// 但是async/await不能运用在普通函数里
let foo = await getFoo();
let bar = await getBar();

// 同时触发 写法1
let [foo, bar] = await Promise.all([getFoo(), getBar()]);
// 同时触发 写法2
let fooPromise = getFoo();
let barPromise = getBar();

let foo_result = await fooPromise;
let bar_result = await barPromise;

async function dbFunc() {
  let docs = [{}, {}, {}];

  // 此时使用await会报错，forEach的回调不是一个async函数
  // 即使为forEach的回调设置为async函数，也可能会得到错误的结果

  // 因为forEach的回调，是一个并发执行的，并不是继发执行的，而await会阻塞再去执行下一个。会冲突
  docs.forEach(async (doc) => {
    await db.post(doc);
  });

  // 可以使用for循环来处理这个问题
  for (let doc of docs) {
    await db.post(doc);
  }
}

// async 自动执行器疯转的简易源码
function packing(generatorFun) {
  return new Promise(function (resolve, reject) {
    // 获取传入的generator函数
    const gen = generatorFun();
    function step(nextFun) {
      let next;
      try {
        next = nextFun(); // 获取当前阶段的返回值
      } catch (error) {
        return reject(error); // 记录错误信息
      }

      if (next.done) return resolve(next.value);

      Promise.resolve(next.value).then(
        function (v) {
          step(function () {
            return gen.next(v); //执行下一阶段，递归调用step执行generator下一阶段
          });
        },
        function (error) {
          step(function () {
            return gen.throw(error); //返回错误信息
          });
        }
      );
    }

    step(function () {
      return gen.next(undefined);
    });
  });
}
