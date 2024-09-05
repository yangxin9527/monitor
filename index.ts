import initMonitor from "./src/index";

console.log("112");
function Shell(window) {
  if (!window.initMonitor) {
    window.initMonitor = initMonitor;
  }
}

Shell(window);
