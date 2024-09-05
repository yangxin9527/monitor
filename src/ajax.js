

const ajax = (function () {
  return {
    post(url, data, timeout) {
      const xhr = new XMLHttpRequest();
      console.log("=========发送错误日志记录========");
      console.log(data);

      // xhr.open("post", url, true);
      // xhr.setRequestHeader("content-type", "application/json;charset=utf-8");
      // xhr.setRequestHeader("Accept", "application/json");
      // xhr.withCredentials = true;
      // xhr.timeout = timeout || 30000;
      // xhr.onload = function () {
      //   const result = window.JSON.parse(xhr.responseText);
      //   if (result.status === 1) {
      //     // changeStatus();
      //   }
      // };
      // xhr.onreadystatechange = function () {
      //   if (xhr.readyState === 4) {
      //     if (xhr.status === 200) {
      //       const result = window.JSON.parse(xhr.responseText);
      //       if (result.status === 1) {
      //         // changeStatus();
      //       }
      //     } else {
      //       console.log(xhr);
      //       throw new Error("网络请求错误，请稍后再试～");
      //     }
      //   }
      // };
      // xhr.send(window.JSON.stringify(data));
    },

  };
}());

module.exports = {
  ajax,
};
