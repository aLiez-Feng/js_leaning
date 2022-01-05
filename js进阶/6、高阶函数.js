let arr = [1, 2, 3];

Array.prototype.myForEach = function (callBack) {
  console.log("callBack", callBack);
  console.log("this", this);
  let length = this.length;
  if (typeof callBack !== "function") {
    throw new Error("myForEach的参数必须为一个函数！");
  }

  for (let i = 0; i < length; i++) {
    callBack.call(this, this[i], i);
  }
};

let returnValue = arr.myForEach((res) => {
  console.log(res);
});

console.log(returnValue);

Array.prototype.myMap = function (callBack) {
  let length = this.length;
  let newArr = [];
  if (typeof callBack !== "function") {
    throw new Error("myMap的参数必须是一个函数！");
  }

  for (let i = 0; i < length; i++) {
    newArr.push(this[i]);
    callBack.call(this, this[i], i);
  }

  return newArr;
};

let returnMapValue = arr.myMap((res) => {
  console.log(res);
});
console.log(returnMapValue);

/*
  reduce方法
  参数一：（函数）
    函数的形参
      pre   => 上一轮循环返回的值
      now   => 当前循环的值
      index => 当前循环的序列（索引）
      arr   =>  总数组(原数组)
  参数二：参数一 ( pre ) 的初始值
  如果不传入该参数将会值循环数组长度-1次[0]位不进行循环
  并且pre将会是数组的[0]位，now将会是数组的[1]位，将会跳过[0]循环
*/

let result = arr.reduce((pre, now, index, arr) => {
  console.log(pre);
  console.log(now);
  return pre + now;
}, 0);

console.log(result);

// reduce在Vue-route中的使用

let obj = [
  {
    path: "/",
    components: "xxx",
  },
  {
    path: "/index",
    components: "xxx",
  },
  {
    path: "/home",
    components: "xxx",
  },
];

let result1 = obj.reduce((pre, now) => {
  pre[now.path] = now.components;
  return pre;
}, {});

console.log(result1); //{"/":"xxx"}

let allUser = [
  {
    name: "admin",
    money: 50,
  },
  {
    name: "admin",
    money: 50,
  },
  {
    name: "admin",
    money: 50,
  },
  {
    name: "xxx",
    money: 50,
  },
];

let adminMoney = allUser.reduce((pre, now) => {
  if (now.name === "admin") {
    pre += now.money;
  }
  return pre;
}, 0);

console.log(adminMoney);

Array.prototype.myReduce = function (fun, init) {
  let i = 0;
  let pre = init;
  let length = this.length;
  if (typeof fun !== "function") {
    throw new Error("myReduce的第一个参数必须是一个函数！");
  }

  if (init === "undefined") {
    pre = this[0];
    i = 1;
  }

  for (i; i < length; i++) {
    pre = fun.call(this, pre, this[i], i, this);
  }

  return pre;
};

let myReduceResult = allUser.myReduce((pre, now) => {
  if (now.name === "admin") {
    pre += now.money;
  }
  return pre;
}, 0);

console.log(myReduceResult);

let newArr = arr.filter((current, index) => {
  return current % 2 == 0;
});

console.log(newArr);

Array.prototype.myFilter = function (fun) {
  let _newArr = [];
  let _length = this.length;

  if (typeof fun !== "function") {
    throw new Error("myFilter方法的参数必须是一个函数！");
  }

  for (let i = 0; i < _length; i++) {
    if (fun.call(this, this[i], i)) {
      // 如果数组内部是一个对象的话，解除引用关系
      if (typeof this[i] === "object") {
        _newArr.push(Object.create(this[i]));
      } else {
        _newArr.push(this[i]);
      }
    }
  }
  return _newArr;
};

let mynewArr = arr.myFilter((current, index) => {
  return current % 2 == 0;
});

console.log(mynewArr);

// 高阶函数尝试
let myObj = {
  name1: 1,
  name2: 2,
  name3: 3,
  name4: 4,
  name5: 5,
  name6: 6,
};

function findProperty(value, fun) {
  if (typeof value !== "object") {
    throw new Error(`${value}不是一个对象！`);
  }
  let _value = Object.create(value);
  let _result = [];
  for (let item in value) {
    if (fun.call(_value, _value[item], item)) {
      _result.push(item);
    }
  }
  return _result;
}

let findProperty_result = findProperty(myObj, (item, i) => {
  console.log(i);
  return item % 2 == 0;
});

console.log(findProperty_result);
