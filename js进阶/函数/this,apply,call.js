let window = {
  name: "111",
  age: "12",
};

let testName = "外部";
let obj = {
  name: "obj111",
  objAge: window.age,
  testFn: function (otherArg, name) {
    return this.age + "--传入参数--: " + otherArg + (name ? name : "");
  },
};

console.log(this);
console.log(obj.objAge);
console.log(obj.testFn.call(window, window.name));
console.log(obj.testFn.apply(window, [window.name, testName]));
