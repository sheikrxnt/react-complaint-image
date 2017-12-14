import React from "react";
import { Text } from "react-konva";

export default function Complaint({ index, pos: { x, y }, ...conf }) {
  let text = index < 9 ? ` ${index + 1}` : `${index + 1}`;
  return (
    <Text
      x={x - conf.fontSize / 2}
      y={y - conf.fontSize / 2}
      {...conf}
      text={text}
    />
  );
}
