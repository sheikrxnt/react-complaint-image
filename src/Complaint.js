import React from "react";
import { Circle } from "react-konva";

export default function Complaint({ pos: { x, y }, ...conf }) {
  return <Circle x={x} y={y} {...conf} onClick={() => console.log("Circle")} />;
}
