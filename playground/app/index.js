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
    {
      pos: { x: 201, y: 219 },
      text: "Damage to the liver",
    },
    { pos: { x: 345, y: 360 }, text: "Knee pain" },
    {
      pos: { x: 362, y: 125 },
      text: "",
    },
    { pos: { x: 410, y: 97 }, text: "" },
    { pos: { x: 335, y: 31 }, text: "" },
    {
      pos: {
        x: 364,
        y: 234,
      },
      text: "",
    },
    { pos: { x: 372, y: 54 }, text: "" },
    { pos: { x: 184, y: 57 }, text: "" },
    {
      pos: {
        x: 141,
        y: 29,
      },
      text: "",
    },
    { pos: { x: 174, y: 26 }, text: "" },
    { pos: { x: 220, y: 47 }, text: "" },
    { pos: { x: 261, y: 70 }, text: "" },
    { pos: { x: 211, y: 95 }, text: "" },
    { pos: { x: 278, y: 139 }, text: "" },
    {
      pos: {
        x: 229,
        y: 121,
      },
      text: "",
    },
  ],
};

let ComplaintImage = factory();

ReactDOM.render(
  <ComplaintImage
    images={images}
    value={value}
    markerColors={[
      "#38A8E8",
      "#5D6C89",
      "#8C756A",
      "#1AC8DB",
      "#0292B7",
      "#5B7485",
      "#89CFF0",
    ]}
    onChange={state => console.log(JSON.stringify(state))}
  />,
  document.getElementById("app")
);
