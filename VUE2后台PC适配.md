# Vue2+pc后台适配

### 1、复制到package.json -> dependencies -> npm i

```json
    "lib-flexible": "^0.3.2",
    "postcss-plugin-px2rem": "^0.8.1"
```

### 2、创建src/utils/flexble/flexble.js
```javascript
//flexible.js
(function (win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    var flexibleEl = doc.querySelector('meta[name="flexible"]');
    var dpr = 0;
    var scale = 0;
    var tid;
    var flexible = lib.flexible || (lib.flexible = {});

    if (metaEl) {
        console.warn("将根据已有的meta标签来设置缩放比例");
        var match = metaEl
            .getAttribute("content")
            .match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    } else if (flexibleEl) {
        var content = flexibleEl.getAttribute("content");
        if (content) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
        }
    }

    if (!dpr && !scale) {
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;
    }

    docEl.setAttribute("data-dpr", dpr);
    if (!metaEl) {
        metaEl = doc.createElement("meta");
        metaEl.setAttribute("name", "viewport");
        metaEl.setAttribute(
            "content",
            "initial-scale=" +
            scale +
            ", maximum-scale=" +
            scale +
            ", minimum-scale=" +
            scale +
            ", user-scalable=no"
        );
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement("div");
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        if (width / dpr > 540) {
            width = width * dpr;
        }
        console.log("width", width);
        var changeNum = 10;
        if (width < 1728) {
            changeNum = 9;
        }
        if (width < 1536) {
            changeNum = 8;
        }
        if (width < 1344) {
            changeNum = 7;
        }
        if (width < 1152) {
            changeNum = 6;
        }
        if (width < 960) {
            changeNum = 5;
        }
        if (width < 768) {
            changeNum = 4;
        }
        if (width < 576) {
            changeNum = 3;
        }
        if (width < 384) {
            changeNum = 2;
        }
        if (width < 150) {
            changeNum = 0;
        }
        var rem = width / changeNum;
        docEl.style.fontSize = rem + "px";
        flexible.rem = win.rem = rem;
    }

    win.addEventListener(
        "resize",
        function () {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        },
        false
    );
    win.addEventListener(
        "pageshow",
        function (e) {
            if (e.persisted) {
                clearTimeout(tid);
                tid = setTimeout(refreshRem, 300);
            }
        },
        false
    );

    if (doc.readyState === "complete") {
        doc.body.style.fontSize = 12 * dpr + "px";
    } else {
        doc.addEventListener(
            "DOMContentLoaded",
            function (e) {
                doc.body.style.fontSize = 12 * dpr + "px";
            },
            false
        );
    }

    refreshRem();

    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function (d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === "string" && d.match(/rem$/)) {
            val += "px";
        }
        return val;
    };
    flexible.px2rem = function (d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === "string" && d.match(/px$/)) {
            val += "rem";
        }
        return val;
    };
})(window, window["lib"] || (window["lib"] = {}));
```

### 3、main.js引入

```javascript
import "lib-flexible";
//屏幕分辨率适配
import "./utils/flexible/flexible";
```

### 4、vue.config.js配置

```javascript
  css: {
    loaderOptions: {
      postcss: {
        // 是否使用css分离插件 ExtractTextPlugin
        plugins: [
          require("postcss-plugin-px2rem")({
            rootValue: 192, //换算基数，1rem相当于10px,值为37.5时,1rem为20px,淘宝的flex默认为1rem为10px
            // unitPrecision: 5, //允许REM单位增长到的十进制数字。
            //propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
            // propBlackList: [], //黑名单
            exclude: /(node_module)/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)\/如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
            // selectorBlackList: [], //要忽略并保留为px的选择器
            // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
            // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
            mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
            minPixelValue: 1 //设置要替换的最小像素值(3px会被转rem)。 默认 0
          })
        ]
      }
    }
  }
```

### 5、重启 

