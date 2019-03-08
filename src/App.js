import React from "react";
import LayoutComponent from "./components/LayoutComponent";

const { dialog } = window.require("electron").remote;
const fs = window.require("fs");
const path = window.require("path");

export default class App extends React.Component {
  state = {
    text: "",
    title: "Untitled",
    path: null,
    modified: false,
    isDropOver: false
  };
  componentDidMount() {
    document.addEventListener("keydown", this.keyboardShortcuts);
  }
  keyboardShortcuts = e => {
    if ((e.which === 83 || e.keyCode === 83) && e.ctrlKey) {
      e.preventDefault();
      this.SaveFile();
    }
  };
  onLoadClicked = () => {
    let _path = dialog.showOpenDialog({
      title: "불러오기",
      filters: [
        { name: "텍스트", extensions: ["txt"] },
        { name: "모든 파일", extensions: ["*"] }
      ]
    });
    if (!_path) return;
    if (_path.length > 1) {
      window.alert("파일 중 하나만 선택해주세요!");
      return;
    }
    _path = _path[0];
    this.loadFile(_path);
  };
  loadFile = _path => {
    try {
      let data = fs.readFileSync(_path, { encoding: "utf-8" });
      this.setState({
        title: path.basename(_path),
        path: _path,
        modified: false,
        text: data.toString().replace(/\r\n/g, "\n")
      });
    } catch (e) {
      window.alert(e.message);
    }
  };
  SaveFile = () => {
    let _path = this.state.path;
    if (_path === null) {
      _path = dialog.showSaveDialog({
        title: "저장",
        filters: [
          { name: "텍스트 파일", extensions: ["txt"] },
          { name: "모든 파일", extensions: ["*"] }
        ]
      });
      if (!_path) return;
    }

    fs.writeFile(
      _path,
      this.state.text.replace(/\n/g, "\r\n"),
      { encoding: "utf-8" },
      err => {
        if (err) {
          window.alert(err.message);
          return;
        }
      }
    );
    this.setState({
      title: path.basename(_path),
      path: _path,
      modified: false
    });
  };
  NewFile = () => {
    this.setState({
      title: "Untitled",
      path: null,
      modified: false,
      text: ""
    });
  };
  render() {
    return (
      <LayoutComponent
        title={this.state.title + (this.state.modified ? "(*)" : "")}
        onLoadClicked={this.onLoadClicked}
        onSaveClicked={this.SaveFile}
        onNewFileClicked={this.NewFile}
        onClose={() => {
          if (!this.state.modified) {
            return true;
          }
          return window.confirm("정말 종료하시겠습니까?");
        }}
      >
        <div
          className="Home"
          style={{ flex: 1 }}
          onDrop={e => {
            e.preventDefault();
            if (e.dataTransfer.items) {
              if (e.dataTransfer.items.length > 1) {
                window.alert("하나만 드롭해주세요.");
                return;
              }
              let item = e.dataTransfer.items[0];
              if (item.kind !== "file") {
                window.alert("파일을 드롭해주세요.");
                return;
              }
              this.loadFile(item.getAsFile().path);
              if (!this.state.isDropOver) {
                return;
              }
              this.setState({
                isDropOver: false
              });
              e.preventDefault();
            }
          }}
          onDragOver={e => {
            if (this.state.isDropOver) {
              return;
            }
            this.setState({
              isDropOver: true
            });
            e.preventDefault();
          }}
          onDragLeave={e => {
            if (!this.state.isDropOver) {
              return;
            }
            this.setState({
              isDropOver: false
            });
            e.preventDefault();
          }}
        >
          {this.state.isDropOver ? (
            <div
              style={{
                position: "fixed",
                left: "30%",
                right: "30%",
                fontSize: "1.5rem",
                textAlign: "center",
                borderRadius: "1rem",
                color: "white",
                background: "rgba(0,0,0,0.3)",
                top: "20%",
                padding: "1rem"
              }}
            >
              여기에 드롭하세요
            </div>
          ) : null}
          <textarea
            onChange={e => {
              this.setState({
                text: e.currentTarget.value,
                modified: true,
                title: this.state.title
              });
            }}
            value={this.state.text}
            className="editor"
            style={{
              whiteSpace: "nowrap"
            }}
          />
        </div>
      </LayoutComponent>
    );
  }
}
