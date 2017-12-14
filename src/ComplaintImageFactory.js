import React, { Component } from "react";
import PropTypes from "prop-types";
import { Image, Layer, Stage } from "react-konva";
import ComplaintMarker from "./ComplaintMarker";
import ComplaintIndicator from "./ComplaintIndicator";

export default function(Complaints, SelectImages) {
  class ComplainImage extends Component {
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

    handleTextChange = (i, text) => {
      this.setState(({ url, complaints }) => {
        let complaint = Object.assign({}, complaints[i], { text });

        complaints = complaints.slice();
        complaints.splice(i, 1, complaint);

        this.props.onChange({ url, complaints });
        return { url, complaints };
      });
    };

    handleDelete = i => {
      this.setState(({ url, complaints }) => {
        complaints = complaints.slice();
        complaints.splice(i, 1);

        this.props.onChange({ url, complaints });
        return { url, complaints };
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
          <div className="col-md-4">
            <h3 className="panel-title text-center">Select Image</h3>
            <SelectImages
              images={images}
              selected={url}
              onSelect={this.changeImage}
            />
            <Stage width={450} height={450} onClick={this.handleClick}>
              <Layer width={450} height={450} visible>
                <Image image={image} />
                {complaints.map((conf, i) => (
                  <ComplaintMarker key={i} index={i} {...conf} {...circle} />
                ))}
                {complaints.map((conf, i) => (
                  <ComplaintIndicator key={i} index={i} {...conf} {...text} />
                ))}
              </Layer>
            </Stage>
          </div>
          <div className="col-md-8 text-center">
            <h3 className="panel-title">Complaints</h3>
            <Complaints
              complaints={complaints}
              onChange={this.handleTextChange}
              onDelete={this.handleDelete}
            />
          </div>
        </div>
      );
    }
  }

  ComplainImage.defaultProps = {
    complaints: [],
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

  return ComplainImage;
}
