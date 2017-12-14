import ReactDOM from "react-dom";
import React from "react";
import factory from "../../src";

const images = [
  { name: "Male Anatomy", url: "/app/male-anatomy.jpg" },
  { name: "Female Anatomy", url: "/app/female-anatomy.jpg" },
];

const value = {
  url: "/app/female-anatomy.jpg",
  complaints: [
    { pos: { x: 419, y: 36 }, text: "Hair burned" },
    { pos: { x: 201, y: 219 }, text: "Damage to the liver" },
    { pos: { x: 345, y: 360 }, text: "Knee pain" },
  ],
};

let ComplaintImage = factory();

ReactDOM.render(
  <ComplaintImage
    images={images}
    value={value}
    onChange={state => console.log(JSON.stringify(state))}
  />,
  document.getElementById("app")
);
