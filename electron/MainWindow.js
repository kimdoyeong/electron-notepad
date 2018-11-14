const { BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

const URL =
  process.env.ELECTRON_URL ||
  url.format({
    pathname: path.join(__dirname, "/../build"),
    protocol: "file:",
    slashes: true
  });
let window = null;

module.exports = {
  createWindow: () => {
    window = new BrowserWindow({
      width: 1600,
      height: 800,
      frame: false
    });
    window.loadURL(URL);
    window.webContents.openDevTools();

    window.on("closed", () => {
      window = null;
    });
  },
  isWindow: () => {
    if (window) return true;
    return false;
  }
};
