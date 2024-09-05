
// import Monitor from "./initMonitor";
// import Monitor from "./monitor";

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
};
const report = (data) => {
  console.log("--------报错收集-------------");
  console.log(data);
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
          report({
            url: this._url,
            method: this._method,
            status: this.status,
            statusText: this.statusText,
          });
        }
      });

      this.addEventListener("error", function () {
        report({
          url: this._url,
          method: this._method,
          error: "Network Error",
        });
      });
      // 监听请求超时
      this.addEventListener("timeout", function () {
        report({
          url: this._url,
          method: this._method,
          error: "Request Timeout",
        });
      });
    }

    originalSend.apply(this, args);
  };
};

const initListenFetch = ()=>{
  // 保存原始 fetch 函数
const originalFetch = window.fetch;

window.fetch = async function(...args) {
    try {
        const response = await originalFetch.apply(this, args);
        
        // 检查 HTTP 响应状态码
        if (!response.ok) {
            // 响应错误，记录并上报
            report({
                url: args[0],
                method: args[1]?.method || 'GET',
                status: response.status,
                statusText: response.statusText
            });
        }

        return response;
    } catch (error) {
        // 捕获网络错误
        report({
            url: args[0],
            method: args[1]?.method || 'GET',
            error: error.message
        });
        throw error; // 不影响原请求的执行
    }
};

}
const initMonitor = () => {
  // js异常，资源加载异常
  // api异常：xhr fetch
  initListenXHR();
  initListenFetch()
  // 页面性能：
  // 白屏：
};

const init = (userConfig, callback) => {
  monitor.config = initConfig(userConfig);
  monitor.instance = initMonitor();
  if (callback) {
    // callback(new Monitor(res));
  }
  // 初始化
  return monitor;
};

export default init;
