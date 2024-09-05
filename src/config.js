

function Config(conf) {
  const self = this;
  self._extend(self, conf);
}

Config.prototype = {
  https: true,
  post: true,
  url: "/monitor",
  record: false,
  _extend: (self, conf) => {
    Object.keys(conf).map((x) => {
      self[x] = conf[x];
      return;
    });
    return self;
  },
};
export default Config;
