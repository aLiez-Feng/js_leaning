function addTwo(num) {
  return num + 2;
}
function addThree(num) {
  return num + 3;
}
function XTwo(num) {
  return num * 2;
}
function minusOne(num) {
  return num - 1;
}

// function compose() {
//   let args = [].slice.apply(arguments);
//   return function (num) {
//     let _num = num;
//     for (let i = args.length - 1; i >= 0; i--) {
//       _num = args[i](_num);
//     }
//     return _num;
//   };
// }

function compose() {
  let args = [].slice.apply(arguments);
  return function (num) {
    return args.reduceRight((res, cb) => cb(res), num);
  };
}

console.log(compose(addTwo, addThree, minusOne, XTwo)(10));
