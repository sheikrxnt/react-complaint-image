import React from "react";

export default function SelectImages({ images, selected, onSelect }) {
  return (
    <div className="form-group field field-number">
      <select
        onChange={evt => onSelect(evt.target.value)}
        value={selected}
        className="form-control">
        {images.map(({ name, key }, i) => (
          <option key={i} value={key}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
