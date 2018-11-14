import React from "react";
export default class MenuComponent extends React.Component {
  render() {
    return (
      <div
        style={{
          position: "absolute"
        }}
      >
        <ul>
          <li>
            <button>불러오기</button>
          </li>
        </ul>
      </div>
    );
  }
}
