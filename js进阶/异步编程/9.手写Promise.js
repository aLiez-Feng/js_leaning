function light(color, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`${color} = ${delay}`);
      resolve();
    }, delay * 1000);
  });
}

function orderLight(arr) {
  let promise = Promise.resolve();
  arr.forEach((item) => {
    promise = promise.then(() => {
      return light(item.color, item.delay);
    });
  });

  promise.then(() => {
    return orderLight(arr);
  });
}

let arr = [
  {
    color: "red",
    delay: 3,
  },
  {
    color: "green",
    delay: 2,
  },
  {
    color: "yellow",
    delay: 1,
  },
];

orderLight(arr);
