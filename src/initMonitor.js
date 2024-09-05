
import { record } from "rrweb";
import Config from "./config";
// import { getJsError, getResourceError, ajaxError } from "./error";
import { ajaxError, getResourceError } from "./error";
import EventCenter from "./eventCenter";
import { ajax } from "./ajax";
import { _getErrorMessage } from "./wrap";


function Monitor(userConfig) {
  // const config = new Config(userConfig);
  // this._config = config;

  // this._config.protocol = `${window.location.protocol}//`;
  // if (config.https) {
  //   this._config.protocol = "https://";
  // }
  // const eventCenter = new EventCenter();
  // this._eventCenter = eventCenter;

  this._initListenJS();
  // this._initListenAjax();

  // if (userConfig.record) {
  //   this._initRrweb();
  // }
}


Monitor.prototype = {
  sendError(event, desc) {
    const data = _getErrorMessage(event, desc);
    data.record = [];

    const config = this._config;
    // if (config.record) {
    //   data.record = this._getRrwebEvent();
    // }
    ajax.post(config.protocol + config.url, data, () => {
      this._clearEvent();
    },
    (error) => {
      console.log(error);
    });
  },
  _initListenJS() {
    const self = this;

    // 监听全局下的 Promise 错误
    const unhandledrejection = (event) => {
      this.sendError(event, "未处理的 Promise 异常");
    };
    window.addEventListener("unhandledrejection", unhandledrejection);
    self._setEvent({
      type: "unhandledrejection",
      func: unhandledrejection,
    });

    // 监听全局下的error事件
    const errorEvent = (event) => {
      console.log("(===========);", event);

      // 判断错误是否来自 monitor
      if (event && event.filename && event.filename.indexOf("webpack:") > -1) {
        return;
      }

      if (event.target instanceof HTMLImageElement) {
        this.sendError(event, "资源加载错误 - 图片");
      } else if (event.target instanceof HTMLScriptElement) {
        this.sendError(event, "资源加载错误 - 脚本");
      } else if (event.target instanceof HTMLLinkElement) {
        this.sendError(event, "资源加载错误 - 样式表");
      } else if (event.target instanceof HTMLIFrameElement) {
        this.sendError(event, "资源加载错误 - iframe");
      } else {
        this.sendError(event, "普通js错误");
      }
    };
    window.addEventListener("error", errorEvent, true);
    self._setEvent({
      type: "error",
      func: errorEvent,
    });
  },
  _initListenAjax() {
    const self = this;


    // // 保存原始的 XMLHttpRequest open 和 send 方法
    // const originalOpen = XMLHttpRequest.prototype.open;
    // const originalSend = XMLHttpRequest.prototype.send;

    // XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    //   // 保存请求的 URL 和 method 以便后续使用
    //   this._url = url;
    //   this._method = method;

    //   // 调用原始 open 方法
    //   originalOpen.apply(this, [method, url, ...rest]);
    // };

    // XMLHttpRequest.prototype.send = function (...args) {
    //   this.addEventListener("load", function () {
    //     if (this.status >= 400) {
    //       // 响应错误，记录相关信息
    //       logError({
    //         url: this._url, // 获取保存的 URL
    //         method: this._method, // 获取保存的 method
    //         status: this.status,
    //         statusText: this.statusText,
    //       });
    //     }
    //   });

    //   this.addEventListener("error", function () {
    //     // 网络错误
    //     logError({
    //       url: this._url, // 获取保存的 URL
    //       method: this._method, // 获取保存的 method
    //       error: "Network Error",
    //     });
    //   });

    //   originalSend.apply(this, args);
    // };


    // // custom-xhr.js
    // const OriginalXMLHttpRequest = window.XMLHttpRequest;
    // function handleError(xhr, type) {
    //   console.log(`错误类型: ${type}`, xhr);
    //   // 这里可以将错误信息发送到服务器或进行其他处理
    //   // 例如: sendErrorToServer(xhr, type);
    //   this.sendError(xhr, type);
    // }
    // function CustomXMLHttpRequest(...args) {
    //   const xhr = new OriginalXMLHttpRequest();

    //   // 覆盖 open 方法
    //   const originalOpen = xhr.open;
    //   xhr.open = function (method, url, async, user, password) {
    //     console.log("请求开始:", method, url);
    //     originalOpen.call(xhr, method, url, async, user, password);
    //   };

    //   // 覆盖 send 方法
    //   const originalSend = xhr.send;
    //   xhr.send = function (data) {
    //     console.log("发送数据:", data);
    //     originalSend.call(xhr, data);
    //   };

    //   // 监听 readyState 变化
    //   const originalOnreadystatechange = xhr.onreadystatechange;
    //   xhr.onreadystatechange = () => {
    //     if (xhr.readyState === 4) {
    //       if (xhr.status >= 200 && xhr.status < 300) {
    //         // 请求成功
    //         console.log("请求成功，状态码：", xhr.status);
    //       } else {
    //         // 请求失败
    //         console.log("请求失败，状态码：", xhr.status);
    //         self.sendError(xhr, "HTTP 请求错误");
    //       }
    //     }
    //     if (originalOnreadystatechange) {
    //       originalOnreadystatechange.apply(xhr, args);
    //     }
    //   };

    //   // 监听 error 事件
    //   const originalOnerror = xhr.onerror;
    //   xhr.onerror = () => {
    //     console.log("请求过程中发生错误");
    //     self.sendError(xhr, "HTTP 请求错误");
    //     if (originalOnerror) {
    //       originalOnerror.apply(xhr, args);
    //     }
    //   };

    //   return xhr;
    // }

    // window.XMLHttpRequest = CustomXMLHttpRequest;


    self._startListenAjax();
  },
  _startListenAjax() {
    const self = this;
    // ajax timeout
    const ajaxTimeout = function (err) {
      !(err.detail.responseURL.indexOf(self._config.url) > -1) && ajaxError(err, self);
    };
    window.addEventListener("ajaxTimeout", ajaxTimeout);
    self._setEvent({
      type: "ajaxTimeout",
      func: ajaxTimeout,
    });

    // ajax load error
    const ajaxLoad = function (err) {
      !(err.detail.responseURL.indexOf(self._config.url) > -1) && ajaxError(err, self);
    };
    window.addEventListener("ajaxLoad", ajaxLoad);
    self._setEvent({
      type: "ajaxLoad",
      func: ajaxLoad,
    });
  },
  _getEvent() {
    const self = this;
    return self._eventCenter._get();
  },
  _getRrwebEvent() {
    const self = this;
    return self._eventCenter._getRecord();
  },
  _setEvent(event) {
    const self = this;
    self._eventCenter._set(event);
  },
  /**
   * clear rrweb event
   */
  _clearEvent() {
    const self = this;
    self._eventCenter._clearRecord();
  },
  /**
   * init rrweb
   */
  _initRrweb() {
    const self = this;
    /**
     * init record function to record event in browser
     * @event mouseevent
     * @param { Object } event
     */
    record({
      emit(event) {
        self._eventCenter._setRecord(event);
      },
    });
  },
};

export default Monitor;
