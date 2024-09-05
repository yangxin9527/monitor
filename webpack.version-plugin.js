const fs = require("fs");
const path = require("path");

class VersionPlugin {
  constructor(options) {
    this.versionFile = options.versionFile;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("VersionPlugin", (compilation) => {
      compilation.hooks.beforeModuleIds.tap("VersionPlugin", () => {
        const jsonPath = path.resolve(__dirname, this.versionFile);
        if (fs.existsSync(jsonPath)) {
          const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
          this.version = data.version;
        } else {
          console.error(`${this.versionFile} file not found.`);
        }
      });
    });

    compiler.hooks.emit.tapAsync("VersionPlugin", (compilation, callback) => {
      if (this.version) {
        // 修改输出文件名
        compilation.options.output.filename = `monitor.${this.version}.js`;
      }
      callback();
    });
  }
}

module.exports = VersionPlugin;
