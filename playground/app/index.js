import ReactDOM from "react-dom";
import React, { Component } from "react";
// import { complaintImageFactory } from "../../src";
import {
  multipleComplaintImageFactory,
  complaintImageFactory, //eslint-disable-line
} from "../../src";

const images = [
  { name: "Male Anatomy", url: "/app/male-anatomy.jpg", key: "male" },
  { name: "Female Anatomy", url: "/app/female-anatomy.jpg", key: "female" },
];

const singleImageValue = {
  //eslint-disable-line

  url: "/app/male-anatomy.jpg",
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
      text: "Some Issues",
    },
  ],
  uiDisplay: "typeahead",
  uiOptions: {
    options: [
      "Head and Heck",
      "Neck",
      "Liver",
      "Hair burned",
      "Damage to the liver",
      "Knee pain",
    ],
    multiple: true,
    allowNew: true,
    autoFocus: true,
  },
};

const value = {
  active: "female",
  male: {
    name: "Male Anatomy",
    url: "/app/male-anatomy.jpg",
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
    // "uiDisplay": "typeahead",
    // uiOptions: {
    //   options: ['Head', "Neck", "Liver", "Hair burned", "Damage to the liver", "Knee pain"],
    //   multiple: false
    // }
  },
  female: {
    name: "Female Anatomy",
    url: "/app/female-anatomy.jpg",
    complaints: [{ pos: { x: 419, y: 36 }, text: "Hair burned" }],
    uiDisplay: "typeahead",
    uiOptions: {
      options: [
        "Head",
        "Neck",
        "Liver",
        "Hair burned",
        "Damage to the liver",
        "Knee pain",
      ],
      multiple: true,
      autoFocus: true,
    },
  },
};

class ImageDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maleDataURI: "",
      femaleDataURI: "",
    };
  }
  render() {
    return (
      <div>
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
          onChange={data => {
            let {
              female: { dataURI: femaleDataURI },
              male: { dataURI: maleDataURI },
            } = data;
            console.log(data);
            this.setState({ maleDataURI, femaleDataURI });
          }}
        />
        <div id="mac">
          <h1>Image Display</h1>
          <img src={this.state.maleDataURI} />
          <img src={this.state.femaleDataURI} />
        </div>
      </div>
    );
  }
}

let ComplaintImage = multipleComplaintImageFactory();

ReactDOM.render(<ImageDisplay />, document.getElementById("app"));
