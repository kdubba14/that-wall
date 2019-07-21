import React from "react";

const MessageBox = props => (
  <div className={`message-box ${props.content.color}`}>
    <p>{props.content.message}</p>
  </div>
);

export default MessageBox;
