
// ----- ajax请求错误 ----

// ajax请求错误
const ajaxRequestError = document.getElementsByClassName("err-ajax-request")[0];
ajaxRequestError.onclick = function () {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.timeout = 3000;
  xhr.open("get", "/ajaxerror", true);
  xhr.setRequestHeader("content-type", "application/json;charset=utf-8");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send();
};

// server 500 error
const servererrAjax = document.getElementsByClassName("servererr-ajax-request")[0];
servererrAjax.onclick = function () {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.timeout = 3000;
  xhr.open("get", "/s22ervererr", true);
  xhr.setRequestHeader("content-type", "application/json;charset=utf-8");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send();
};

// ajax失败
const ajaxFailed = document.getElementsByClassName("fail-ajax-request")[0];
ajaxFailed.onclick = function () {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.timeout = 3000;
  xhr.open("get", "/servererr", true);
  xhr.setRequestHeader("content-type", "application/json;charset=utf-8");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send();
};

// ajax请求超时
const ajaxTimeout = document.getElementsByClassName("timeout-ajax-request")[0];
ajaxTimeout.onclick = function () {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.timeout = 3000;
  xhr.open("get", "/timeout", true);
  xhr.setRequestHeader("content-type", "application/json;charset=utf-8");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send();
};


// ----- js 执行错误 ----

// js 执行错误
const jsRunningerror = document.getElementsByClassName("js-running-error")[0];
jsRunningerror.onclick = function () {
  jsRunningerrorssss;
};

// Promise 错误
const promiseError = document.getElementsByClassName("promise-error")[0];
promiseError.onclick = function () {
  new Promise((resolve, reject) => {
    reject();
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
  window.monitor._destory();
};
