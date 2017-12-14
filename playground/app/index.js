import ReactDOM from "react-dom";
import React from "react";
import factory from "../../src";

const images = [
  { name: "Female Anatomy", url: "/app/female-anatomy.jpg" },
  { name: "Male Anatomy", url: "/app/male-anatomy.jpg" },
];

let ComplaintImage = factory();

ReactDOM.render(
  <ComplaintImage
    images={images}
    onChange={state => console.log(JSON.stringify(state))}
  />,
  document.getElementById("app")
);
