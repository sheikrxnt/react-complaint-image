import React from "react";

export default function ComplaintText({ text }) {
  return (
    <li>
      <input
        type="text"
        value={text}
        className="form-control"
        autoFocus={true}
      />
    </li>
  );
}
