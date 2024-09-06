import { record, pack } from "rrweb";
const initConfig = (config = {}) => {
  const defaultConfig = {
    https: true,
    post: true,
    url: "/monitor",
    record: false,
  };

  return {
    ...defaultConfig,
    ...config,
  };
};
export const monitor = {
  config: null,
  instance: null,
  destroyArray: [], //绑定事件数组，用于销毁实例时清除绑定
  recordData: [[]], // 使用二维数组来存放多个 event 数组
};
const report = (type, data = {}) => {
  console.log("--------报错收集-------------");
  console.log(type, data);
  if (monitor?.config?.url) {
    //每次报错发送最近2次录制的内容
    let json: any = {
      type,
      data,
    };
    if (monitor.config.record) {
      json.events = (monitor.recordData.slice(-2) as any).flat();
    }
    if (monitor?.config?.userId) {
      json.userId = monitor?.config?.userId;
    }
    // 错误上报接口
    fetch(monitor.config.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    }).catch((err) => {
      console.error("错误上报失败：", err);
    });
  } else {
    console.error("配置出错");
  }
};
const initListenXHR = () => {
  // 保存原始的 XMLHttpRequest open 和 send 方法
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._url = url;
    this._method = method;
    originalOpen.apply(this, [method, url, ...rest]);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    // 如果不是错误日志上报请求，才记录网络错误
    if (!this._url.includes(monitor.config.url)) {
      this.addEventListener("load", function () {
        if (this.status >= 400) {
          report("XHR错误", {
            url: this._url,
            method: this._method,
            status: this.status,
            statusText: this.statusText,
          });
        }
      });

      this.addEventListener("error", function () {
        report("XHR错误", {
          url: this._url,
          method: this._method,
          error: "Network Error",
        });
      });
      // 监听请求超时
      this.addEventListener("timeout", function () {
        report("XHR超时", {
          url: this._url,
          method: this._method,
          error: "Request Timeout",
        });
      });
    }

    originalSend.apply(this, args);
  };
  monitor.destroyArray.push(() => {
    XMLHttpRequest.prototype.open = originalOpen;
    XMLHttpRequest.prototype.send = originalSend;
  });
};

const initListenFetch = () => {
  // 保存原始 fetch 函数
  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    let url = args[0] as string;

    try {
      const response = await originalFetch.apply(this, args);

      // 检查 HTTP 响应状态码
      if (!response.ok) {
        // 响应错误，记录并上报
        if (!url.includes("/reportData")) {
          report("fetch error", {
            url: args[0],
            method: args[1]?.method || "GET",
            status: response.status,
            statusText: response.statusText,
          });
        }
      }

      return response;
    } catch (error) {
      // 捕获网络错误
      if (!url.includes("/reportData")) {
        report("fetch error", {
          url: args[0],
          method: args[1]?.method || "GET",
          error: error.message,
        });
      }

      throw error; // 不影响原请求的执行
    }
  };
  monitor.destroyArray.push(() => {
    window.fetch = originalFetch;
  });
};
const initListenJS = () => {
  // 监听全局下的error事件
  const errorEvent = (event) => {
    console.log("(===========);", event);
    if (event.target && (event.target.src || event.target.href)) {
      // console.log("资源加载错误：", event.target.src || event.target.href);
      // 确保捕获到的是资源加载错误，而不是 JS 运行时错误

      const target = event.target;
      const resourceType = target.nodeName.toLowerCase();

      let resourceUrl;
      if (resourceType === "img" || resourceType === "script") {
        resourceUrl = target.src; // 对于 <img> 和 <script> 元素，使用 src 属性
      } else if (resourceType === "link") {
        resourceUrl = target.href; // 对于 <link> (CSS 文件) 使用 href 属性
      }

      console.error(`资源加载错误: ${resourceType} 文件加载失败`, resourceUrl);

      // 这里可以上报错误日志
      report(resourceType + "加载失败", {
        url: resourceUrl,
        error: "Resource failed to load",
      });
    } else {
      console.log("运行时错误：", event.message);
      report("js执行错误", {
        message: event.message,
      });
    }
    // 判断错误是否来自 monitor
    // if (event && event.filename && event.filename.indexOf("webpack:") > -1) {
    //   return;
    // }
  };
  // true 可以捕获js错误和资源加载错误
  window.addEventListener("error", errorEvent, true);
  monitor.destroyArray.push(() => {
    window.removeEventListener("error", errorEvent, true);
  });
};
const initListenPromise = () => {
  const unhandledrejection = (event) => {
    // event.reason 是 Promise 拒绝的原因，通常是一个 Error 对象
    const reason = event.reason;
    const isError = reason instanceof Error;
    report("Promise捕获异常", {
      type: "unhandledrejection",
      message: isError ? reason.message : String(reason), // 错误消息
      stack: isError ? reason.stack : null, // 错误堆栈（如果有）
      reason: reason, // 拒绝的原因
    });
  };
  window.addEventListener("unhandledrejection", unhandledrejection);
  monitor.destroyArray.push(() => {
    window.removeEventListener("unhandledrejection", unhandledrejection);
  });
};
const initRecordWeb = () => {
  if (monitor.config.record) {
    /**
     * init record function to record event in browser
     * @event mouseevent
     * @param { Object } event
     */
    record({
      emit(event, isCheckout) {
        // isCheckout 是一个标识，告诉你重新制作了快照
        if (isCheckout) {
          monitor.recordData.push([]);
        }
        const lastEvents = monitor.recordData[monitor.recordData.length - 1];
        lastEvents.push(event);
      },
      // packFn: pack,
      checkoutEveryNms: 1 * 60 * 1000, // 每1分钟重新制作快照
    });
  }
};
const initMonitor = () => {
  // js异常，资源加载异常
  initListenJS();
  //未捕获的promise
  initListenPromise();

  // api异常：xhr fetch
  initListenXHR();
  initListenFetch();
  //初始化录制

  initRecordWeb();

  // 页面性能：
  // 白屏：
};

const init = (userConfig, callback?) => {
  monitor.config = initConfig(userConfig);
  monitor.instance = initMonitor();
  if (callback) {
    // callback(new Monitor(res));
  }

  // 初始化
  return monitor;
};
const destroy = () => {
  try {
    monitor?.destroyArray.forEach((fun) => fun());
    monitor.config = initConfig();
    monitor.instance = null;
    monitor.destroyArray = [];
    console.log("销毁实例成功，绑定事件已经移除", monitor);
  } catch (e) {
    console.error(e);
  }
};

const initVueReport = (app) => {
  try {
    app.config.errorHandler = (err, instance, info) => {
      // `instance` 是发生错误的 Vue 实例
      // console.log(
      //   "Error occurred in component:",
      //   instance?.type.name || "Anonymous Component"
      // );
      // `info` 提供了附加的错误信息，如生命周期钩子名称
      console.error("Error info:", err, instance, info);

      report("Vue error", {
        err,
        instanceName: instance?.type?.name || "Anonymous Component",
        info,
      });
    };
  } catch (error) {
    console.log("绑定vue监听失败", error);
  }
};
export { init, destroy, initVueReport };
