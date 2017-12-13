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

function Complaint({ pos: { x, y }, ...conf }) {
  return <Circle x={x} y={y} {...conf} />;
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
      this.notify(url, this.state.complaints);
    };
  };

  handleClick = ({ currentTarget: { pointerPos } }) => {
    this.setState(state => {
      let complaints = state.complaints.concat({ pos: pointerPos });

      this.notify(this.state.url, complaints);

      return Object.assign({}, state, { complaints });
    });
  };

  notify = (url, complaints) => {
    if (this.props.onChange) {
      this.props.onChange({ url, complaints });
    }
  };

  render() {
    let { images, complaint } = this.props;
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
            {complaints.map((conf, i) => (
              <Complaint key={i} {...conf} {...complaint} />
            ))}
          </Layer>
        </Stage>
      </div>
    );
  }
}

ComplainImage.defaultProps = {
  complaint: {
    radius: 10,
    stroke: "red",
    strokeWidth: 2,
  },
};

ComplainImage.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  complaint: PropTypes.shape({
    radius: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
  }),
  onChange: PropTypes.func.isRequired,
};
