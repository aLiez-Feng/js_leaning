const status_obj = {
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
  PENDING: "pending",
};

function fuilledPromise(promise, value) {
  if (promise.status !== status_obj.PENDING) return;
  promise.status = status_obj.FULFILLED;
  promise.value = value;
  runCbs(promise.fulfilledCbs, value);
}
function rejectedPromise(promise, reson) {
  if (promise.status !== status_obj.PENDING) return;
  promise.status = status_obj.REJECTED;
  promise.reson = reson;
  runCbs(promise.rejectedCbs, reson);
}

function isFunction(fn) {
  return (
    Object.prototype.toString.call(fn).toLocaleLowerCase() ===
    "[object function]"
  );
}
function isObject(fn) {
  return (
    Object.prototype.toString.call(fn).toLocaleLowerCase() === "[object object]"
  );
}
function isPromise(value) {
  return value instanceof Promise;
}

function resolvePromise(promise, x) {
  // promise 与 value相同 则reject
  if (promise === x) {
    rejectedPromise(promise, new TypeError("cant be the same"));
    return;
  }

  // 如果value是一个promise
  if (isPromise(x)) {
    if (x.status === status_obj.FULFILLED) {
      fuilledPromise(promise, x.value);
      return;
    }
    if (x.status === status_obj.REJECTED) {
      rejectedPromise(promise, x.reson);
      return;
    }
    if (x.status == status_obj.PENDING) {
      x.then(
        () => {
          fuilledPromise(promise, x.value);
        },
        () => {
          rejectedPromise(promise, x.reson);
        }
      );
      return;
    }
    return;
  }

  // 如果value是对象或者函数
  if (isObject(x) || isFunction(x)) {
    // 如果value不是对象也不是函数
    let then;

    // 状态只能修改一次
    let called = false;
    try {
      then = x.then;
    } catch (error) {
      rejectedPromise(promise, error);
      return;
    }

    // 如果是函数
    if (isFunction(then)) {
      try {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise, y);
          },
          (r) => {
            if (called) return;
            called = true;
            rejectedPromise(promise, r);
          }
        );
      } catch (error) {
        if (called) return;
        called = true;
        rejectedPromise(promise, error);
      }
      return;
    } else {
      fuilledPromise(promise, x);
      return;
    }
  } else {
    fuilledPromise(promise, x);
    return;
  }
}

function runCbs(cbs, value) {
  cbs.forEach((item) => {
    item(value);
  });
}

class Promise {
  constructor(fn) {
    this.status = status_obj.PENDING;
    this.value = undefined;
    this.reson = undefined;
    this.fulfilledCbs = [];
    this.rejectedCbs = [];

    fn(
      (value) => {
        console.log("this", this);
        resolvePromise(this, value);
      },
      (reson) => {
        console.log("this", this);
        rejectedPromise(this, reson);
      }
    );
  }

  then(onFulfilled, onRejceted) {
    const promise1 = this;
    const promise2 = new Promise(() => {});

    if (promise1.status === status_obj.FULFILLED) {
      if (!isFunction(onFulfilled)) {
        return promise1;
      }
      setTimeout(() => {
        try {
          const x = onFulfilled(promise1.value);
          resolvePromise(promise2, x);
        } catch (error) {
          rejectedPromise(promise2, error);
        }
      }, 0);
    }

    if (promise1.status === status_obj.REJECTED) {
      if (!isFunction(onRejceted)) {
        return promise1;
      }
      setTimeout(() => {
        try {
          const x = onRejceted(promise1.reson);
          resolvePromise(promise2, x);
        } catch (error) {
          rejectedPromise(promise2, error);
        }
      }, 0);
    }

    if (promise1.status === status_obj.PENDING) {
      onFulfilled = isFunction(onFulfilled)
        ? onFulfilled
        : (value) => {
            return value;
          };
      onRejceted = isFunction(onRejceted)
        ? onRejceted
        : (err) => {
            return err;
          };

      // 需要定时器来模拟异步操作
      promise1.fulfilledCbs.push(() => {
        setTimeout(() => {
          () => {
            try {
              const x = onFulfilled(promise1.value);
              resolvePromise(promise2, x);
            } catch (error) {
              rejectedPromise(promise2, error);
            }
          };
        }, 0);
      });
      // 需要定时器来模拟异步操作
      promise1.rejectedCbs.push(() => {
        setTimeout(() => {
          () => {
            try {
              const x = onRejceted(promise1.reson);
              resolvePromise(promise2, x);
            } catch (error) {
              rejectedPromise(promise2, error);
            }
          };
        }, 0);
      });
    }
    return promise2;
  }
}

Promise.deferred = function () {
  const defered = {};
  defered.promise = new Promise((resolve, reject) => {
    defered.resolve = resolve;
    defered.reject = reject;
  });

  return defered;
};

module.exports = Promise;
