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
    modified: false
  };
  componentDidMount() {
    document.addEventListener("keydown", this.keyboardShortcuts);
  }
  keyboardShortcuts = e => {
    if ((e.which === 83 || e.keyCode === 83) && e.ctrlKey) {
      e.preventDefault();
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

      fs.writeFile(_path, this.state.text.replace(/\n/g, "\r\n"), err => {
        if (err) {
          window.alert(err.message);
          return;
        }
      });
      this.setState({
        title: path.basename(_path),
        path: _path,
        modified: false
      });
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
    try {
      let data = fs.readFileSync(_path);
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
  render() {
    return (
      <LayoutComponent
        title={this.state.title + (this.state.modified ? "(*)" : "")}
        onLoadClicked={this.onLoadClicked}
      >
        <div className="Home" style={{ flex: 1 }}>
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
          />
        </div>
      </LayoutComponent>
    );
  }
}
