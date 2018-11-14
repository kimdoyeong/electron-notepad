import React from "react";
import MenuComponent from "./MenuComponent";
import "../App.css";
import minimizeBtn from "./minimize.svg";
import maximizeBtn from "./maximize.svg";
import loadBtn from "./load.svg";

const { remote } = window.require("electron");

export default class Layout extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <div className="wrap">
        <div className="top-bar">
          <div
            style={{
              display: "flex",
              width: "auto"
            }}
          >
            <button className="btn-mu">
              <img
                src={loadBtn}
                alt="load"
                style={{
                  width: 30,
                  height: 30
                }}
                onDragStart={e => {
                  e.preventDefault();
                }}
                onClick={this.props.onLoadClicked}
              />
            </button>
          </div>
          <div
            style={{
              paddingLeft: 40,
              height: 30
            }}
            className="top-bar-move"
          >
            {this.props.title}
          </div>
          <div className="top-bar-menu">
            <button
              className="btn-mu close"
              onClick={() => {
                remote.getCurrentWindow().close();
              }}
            >
              <span>&times;</span>
            </button>
            <button
              className="btn-mu maximize"
              onClick={() => {
                let win = remote.getCurrentWindow();
                if (win.isMaximized()) {
                  win.unmaximize();
                } else {
                  win.maximize();
                }
              }}
            >
              <img
                src={maximizeBtn}
                alt="Maximize"
                onDragStart={e => {
                  e.preventDefault();
                }}
              />
            </button>
            <button
              className="btn-mu minimize"
              onClick={() => {
                remote.getCurrentWindow().minimize();
              }}
            >
              <img
                src={minimizeBtn}
                alt="Minimize"
                onDragStart={e => {
                  e.preventDefault();
                }}
              />
            </button>
          </div>
        </div>
        <div
          style={{
            height: "100%",
            display: "flex",
            paddingTop: 30
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}
