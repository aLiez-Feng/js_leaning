// 函数式编程 模块化贵方 暴露方式

// 传统面向对象暴露方式
// es6
// 暴露
// function class1() {}
// export default class1;
// 引用
import calss1 from "./module1.js";

// commonjs
// 暴露
// module.exports = calss1;
// 引用
const class1 = require("./module1.js");

// 引用多个
// es6 暴露
// export function fn1() {}
// export function fn2() {}
// es6 引用
import { fn1, fn2 } from "./module1.js";
import * as allModule1 from "./module1.js";
allModule1.fn1();

// commonjs
// 暴露
// function f1() {}
// function f2() {}
// exports.fn1 = f1;
// exports.fn2 = f2;
// 引入
const all = require("./module1");
const moduleFn1 = require("./module1").fn1;
