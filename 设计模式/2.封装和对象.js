function Factory(type) {
  switch (type) {
    case "type1":
      return new Type1();
    case "type2":
      return new Type2();
    case "type3":
      return new Type3();
  }
}

// 模块1
function Model1() {}
// 模块2
function Model2() {}

// 最终的使用类
function Final() {
  this.model1 = new Model1();
  this.model2 = new Model2();
}

let Singleton = function (name) {
  this.name = name;
};

Singleton.getInstance = function (name) {
  if (this.instance) {
    return this.instance;
  }

  return (this.instance = new Singleton(name));
};
