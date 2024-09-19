
const main = () => {
  // ajax请求错误
  const ajaxRequestError = document.getElementsByClassName("err-ajax-request")[0];
  ajaxRequestError.onclick = function () {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.timeout = 3000;
    xhr.open("get", "/api/test-ajax-error", true);
    xhr.setRequestHeader("content-type", "application/json;charset=utf-8");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send();
  };

  // fetch error
  const fetchEle = document.getElementsByClassName("fetch-request")[0];
  fetchEle.onclick = function () {
    fetch("/api/test-fetch-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "测试数据",
      }),
    }).catch((err) => {
      console.error("错误上报失败：", err);
    });
  };

  // // ajax失败
  // const ajaxFailed = document.getElementsByClassName("fail-ajax-request")[0];
  // ajaxFailed.onclick = function () {
  //   const xhr = new XMLHttpRequest();
  //   xhr.withCredentials = true;
  //   xhr.timeout = 3000;
  //   xhr.open("get", "/servererr", true);
  //   xhr.setRequestHeader("content-type", "application/json;charset=utf-8");
  //   xhr.setRequestHeader("Accept", "application/json");
  //   xhr.send();
  // };

  // ajax请求超时
  const ajaxTimeout = document.getElementsByClassName(
    "timeout-ajax-request",
  )[0];
  ajaxTimeout.onclick = function () {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.timeout = 3000;
    xhr.open("get", "/api/timeout", true);
    xhr.setRequestHeader("content-type", "application/json;charset=utf-8");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send();
  };

  // ----- js 执行错误 ----

  // js 执行错误
  const jsRunningerror = document.getElementsByClassName("js-running-error")[0];
  jsRunningerror.onclick = function () {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    jsRunningerrorssss;
  };

  // Promise 错误
  const promiseError = document.getElementsByClassName("promise-error")[0];
  promiseError.onclick = function () {
    const res = new Promise((resolve, reject) => {
      reject(new Error("错误的promise reject"));
    });
  };

  // ----- 资源加载异常 ----

  // js
  const jsload = document.getElementsByClassName("err-js-load")[0];
  jsload.onclick = function () {
    const script = document.createElement("script");
    script.src = "./js/undefied.js";
    document.body.appendChild(script);
  };

  const cssload = document.getElementsByClassName("err-css-load")[0];
  cssload.onclick = function () {
    const css = document.createElement("link");
    css.type = "text/css";
    css.rel = "stylesheet";
    css.href = "./js/undefied.css";
    document.head.appendChild(css);
  };

  const imageload = document.getElementsByClassName("err-image-load")[0];
  imageload.onclick = function () {
    const img = document.createElement("img");
    img.src = "./js/undefied.png";
    document.body.appendChild(img);
  };

  // const iframeload = document.getElementsByClassName("err-iframe-load")[0];
  // iframeload.onclick = function () {
  //   const iframe = document.createElement("iframe");
  //   iframe.src = "./js/undefied.html";
  //   document.body.appendChild(iframe);
  // };

  // ------ 第三方资源错误 ------
  // const resourceError = document.getElementsByClassName("other-resource-error")[0];
  // resourceError.onclick = function () {
  //   const test = document.getElementsByClassName("other-resource-error111")[0];
  //   test.onclick = function () {};
  // };

  // ------ 销毁实例 ------
  const destory = document.getElementsByClassName("destory")[0];
  destory.onclick = function () {
    window._monitor.destroy();
  };

  // 模拟vue错误
  // eslint-disable-next-line no-undef
  const { createApp, ref } = Vue;

  const app = createApp({
    setup() {
      const message = ref("Hello vue!");
      return {
        message,
      };
    },
    methods: {
      handleClick: () => {
        // 模拟 Vue 错误
        throw new Error("模拟 Vue 实例创建时的错误");
      },
    },
  });

  window._monitor.initVueReport(app);
  app.mount("#app");
};
document.addEventListener("DOMContentLoaded", main);
