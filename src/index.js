import React, { Component } from "react";
import PropTypes from "prop-types";
import { Stage, Layer, Image, Circle } from "react-konva";

function SelectImages({ images, selected, onSelect }) {
  return (
    <select onChange={evt => onSelect(evt.target.value)} value={selected}>
      {images.map(({ name, url }, i) => (
        <option key={i} value={url}>
          {name}
        </option>
      ))}
    </select>
  );
}

function Complaint({ pos: { x, y } }) {
  console.log(`drawing complaint ${x} ${y}`);
  return <Circle x={x} y={y} radius={10} stroke={"red"} strokeWidth={4} />;
}

export default class ComplainImage extends Component {
  constructor(props) {
    super(props);

    this.state = { url: "Loading", complaints: [] };
    this.changeImage(props.images[0].url);
  }

  changeImage = url => {
    const image = new window.Image();
    image.src = url;
    image.onload = () => {
      this.setState({
        image: image,
        url,
      });
    };
  };

  handleClick = ({ currentTarget: { pointerPos } }) => {
    this.setState(state => {
      let complaints = state.complaints.concat({ pos: pointerPos });
      return Object.assign({}, state, { complaints });
    });
    console.log(`Clicked ${JSON.stringify(pointerPos)}`);
  };

  render() {
    let { images } = this.props;
    let { url, image, complaints } = this.state;

    return (
      <div>
        <SelectImages
          images={images}
          selected={url}
          onSelect={this.changeImage}
        />
        <Stage width={450} height={450} onClick={this.handleClick}>
          <Layer width={450} height={450} visible />
          <Layer width={450} height={450} visible>
            <Image image={image} />
            {complaints.map((conf, i) => <Complaint key={i} {...conf} />)}
          </Layer>
        </Stage>
      </div>
    );
  }
}

ComplainImage.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
};
