/*
 *
 * 该文件的目的是为了在执行npm run build 之后自动生成README.md 和package.json
 *
 *
 */

const fs = require("fs");
const path = require("path");

const versionInfo = fs.readFileSync("./version.json");
const readme = fs.readFileSync("./README.md");

const packagePath = path.join(__dirname, "./dist/package.json");
const readmePath = path.join(__dirname, "./dist/README.md");

fs.writeFile(packagePath, versionInfo, (err) => {
  if (err) {
    return console.log(err);
  }
});

fs.writeFile(readmePath, readme, (err) => {
  if (err) {
    return console.log(err);
  }
});
