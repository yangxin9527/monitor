

const getIP = (onNewIP) => {
  const MyPeerConnection = window.RTCPeerConnection
  || window.mozRTCPeerConnection
  || window.webkitRTCPeerConnection;
  const pc = new MyPeerConnection({
    iceServers: [
      {
        urls: "stun:stun01.sipphone.com",
      },
      {
        urls: "stun:stun.ekiga.net",
      },
      {
        urls: "stun:stun.fwdnet.net",
      },
      {
        urls: "stun:stun.l.google.com:19302",
      },
      {
        urls: "stun:stun.l.google.com:19302",
      },
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  });
  const noop = function () { };
  const localIPs = {};
  const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;

  function iterateIP(ip) {
    if (!localIPs[ip]) {
      onNewIP(ip);
    }
    localIPs[ip] = true;
  }

  // create a bogus data channel
  pc.createDataChannel("");

  // create offer and set local description
  pc.createOffer().then((sdp) => {
    sdp.sdp.split("\n").forEach((line) => {
      if (line.indexOf("candidate") < 0) return;
      line.match(ipRegex).forEach(iterateIP);
    });

    pc.setLocalDescription(sdp, noop, noop);
  }).catch((reason) => {
    // An error occurred, so handle the failure to connect
  });

  // listen for candidate events
  pc.onicecandidate = function (ice) {
    if (!ice || !ice.candidate
      || !ice.candidate.candidate
      || !ice.candidate.candidate.match(ipRegex)) return;
    ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
  };
};

// 获取 UA 基本信息
const wrapData = () => {
  const data = {};
  const navigator = window.navigator;
  // UA
  data.userAgent = navigator.userAgent;
  // appName
  data.appName = navigator.appName;

  // appVersion
  data.appVersion = navigator.appVersion;

  // CPU
  data.cpuClass = navigator.cpuClass;

  // platform
  data.platform = navigator.platform;

  // product
  data.product = navigator.product;

  // languages
  data.language = navigator.language;

  // url
  data.url = window.location.href;

  // time
  data.time = (new Date()).getTime();

  return data;
};

// 处理错误信息
const _getErrorMessage = (err, diyType = "") => {
  const data = wrapData();
  getIP((ip) => {
    data.ip = ip;
  });
  data.detail = {
    diyType,
  };
  if (err.type === "ajaxLoad") {
    data.detail.responseURL = err.detail.responseURL;
    data.detail.status = err.detail.status;
    data.detail.statusText = err.detail.statusText;
    data.detail.type = "ajaxLoad";
  } else if (err.type === "error") {
    data.detail.message = err.message;
    data.detail.line = err.lineno;
    data.detail.filename = err.filename;
    data.detail.type = "error";
  }
  // data.jsStack = self._getCallStack();
  return data;
};
// const _getCallStack = () => {
//   let stack = "#";
//   let total = 0;
//   let fn = arguments.callee;
//   while ((fn = fn.caller)) {
//     stack = `${stack}${fn.name}`;
//     total++;
//   }
//   return stack;
// };

export { wrapData, _getErrorMessage };
