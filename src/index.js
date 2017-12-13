import React, { Component } from "react";
import PropTypes from "prop-types";
import { Stage, Layer, Image } from "react-konva";
import Complaint from "./Complaint";
import ComplaintNumber from "./ComplaintNumber";
import ComplaintText from "./ComplaintText";

function SelectImages({ images, selected, onSelect }) {
  return (
    <div className="form-group field field-number">
      <label className="control-label">Select Image</label>
      <select
        onChange={evt => onSelect(evt.target.value)}
        value={selected}
        className="form-control">
        {images.map(({ name, url }, i) => (
          <option key={i} value={url}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
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

  handleClick = evt => {
    let { currentTarget: { pointerPos }, target: { className } } = evt;
    if (className !== "Image") {
      return;
    }

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
    let { images, complaint: { circle, text } } = this.props;
    let { url, image, complaints } = this.state;

    return (
      <div className="col-md-12">
        <div className="col-md-4 has-text-centered">
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
                <Complaint key={i} index={i} {...conf} {...circle} />
              ))}
              {complaints.map((conf, i) => (
                <ComplaintNumber key={i} index={i} {...conf} {...text} />
              ))}
            </Layer>
          </Stage>
        </div>
        <div className="col-md-offset-1 col-md-7">
          <h3>Complaints</h3>
          <ol>
            {complaints.map(({ text }, i) => (
              <ComplaintText key={i} text={text} />
            ))}
          </ol>
        </div>
      </div>
    );
  }
}

ComplainImage.defaultProps = {
  complaint: {
    circle: {
      radius: 10,
      stroke: "#38A8E8",
      strokeWidth: 2,
    },
    text: {
      fontSize: 14,
      fill: "lightsalmon",
    },
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
