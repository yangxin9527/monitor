
import { ajax } from "./ajax";

const getErrorData = function (err, initMonitor) {

};

// 服务端返回错误
export const getServerError = function () { };

// ajaxError
export const ajaxError = function (err, initMonitor) {
  // 处理err 上报
  if (err.type === "ajaxLoad" && err.detail.status >= 400) {
    const data = getErrorData(err, initMonitor);
    const config = initMonitor._config;
    console.log("发送错误日志记录", config.protocol + config.url, data);
    ajax.post(config.protocol + config.url, data, () => {
      initMonitor._clearEvent();
    },
    (error) => {
      console.log(error);
    });
  }
};


// 资源加载错误
export const getResourceError = function (err, initMonitor) {
  console.log("资源加载错误");
  const data = getErrorData(err, initMonitor);
  const config = initMonitor._config;
  ajax.post(config.protocol + config.url, data,
    () => {
      initMonitor._clearEvent();
    },
    (error) => {
      console.log(error);
    });
};
