import React from "react";
import { Text } from "react-konva";

export default function Complaint({ index, pos: { x, y }, ...conf }) {
  return <Text x={x} y={y} {...conf} text={index + 1} />;
}
