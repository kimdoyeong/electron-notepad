const { app } = require("electron");
const MainWindow = require("./electron/MainWindow");

app.on("ready", MainWindow.createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (MainWindow.isWindow()) {
    MainWindow.createWindow();
  }
});
