const { BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

const URL =
  process.env.ELECTRON_URL ||
  url.format({
    pathname: path.join(__dirname, "/../build/index.html"),
    protocol: "file:",
    slashes: true
  });
let window = null;

module.exports = {
  createWindow: () => {
    global.ELECTRON_URL = URL;
    window = new BrowserWindow({
      width: 800,
      height: 800,
      minWidth: 400,
      minHeight: 150,
      frame: false
    });
    window.loadURL(URL);
    window.on("closed", () => {
      window = null;
    });
  },
  isWindow: () => {
    if (window) return true;
    return false;
  }
};
