function food1() {
  console.log("food1");
}
function food2() {
  console.log("food2");
}
function food3() {
  console.log("food3");
}
function food4() {
  console.log("food4");
}

function order(params) {}

order.prototype.orderFood1 = function (params) {};
order.prototype.orderFood2 = function (params) {};
order.prototype.orderFood3 = function (params) {};

// 依赖抽象层
function resturn(food) {
  var list = {
    food1: new food1(),
    food2: new food2(),
    food3: new food3(),
  };
  return list[food];
}

function order(food) {
  return resturn(food);
}
