import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Image, Layer, Stage } from "react-konva";
import ComplaintMarker from "./ComplaintMarker";
import ComplaintIndicator from "./ComplaintIndicator";

export default function(Complaints, SelectImages) {
  class ComplainImage extends Component {
    constructor(props) {
      super(props);

      let {
        value: { url = props.images[0].url, complaints = [] } = {},
      } = this.props;

      this.state = { url, complaints, width: 450 };
      this.changeImage(url);
    }

    changeImage = url => {
      const image = new window.Image();
      image.src = url;
      image.onload = () => {
        this.setState(
          {
            image: image,
            url,
          },
          this.notify
        );
      };
    };

    handleClick = evt => {
      let { currentTarget: { pointerPos }, target: { className } } = evt;
      if (className !== "Image") {
        return;
      }

      this.setState(state => {
        let complaints = state.complaints.concat({ pos: pointerPos });
        return Object.assign({}, state, { complaints });
      }, this.notify);
    };

    handleTextChange = (i, text) => {
      this.setState(({ url, complaints }) => {
        let complaint = Object.assign({}, complaints[i], { text });

        complaints = complaints.slice();
        complaints.splice(i, 1, complaint);

        return { url, complaints };
      }, this.notify);
    };

    handleDelete = i => {
      this.setState(({ url, complaints }) => {
        complaints = complaints.slice();
        complaints.splice(i, 1);

        this.props.onChange({ url, complaints });
        return { url, complaints };
      }, this.notify);
    };

    notify = () => {
      if (this.props.onChange) {
        let event = { url: this.state.url, complaints: this.state.complaints };
        this.props.onChange(event);
      }
    };

    componentDidMount() {
      let boundaries = ReactDOM.findDOMNode(
        this.refs["image"]
      ).getBoundingClientRect();
      this.setState({ width: boundaries.width });
    }

    render() {
      let {
        images,
        complaint: { circle, text },
        imageClassName,
        complaintClassName,
        imagePadding,
      } = this.props;
      let { url, image, complaints, width } = this.state;

      return (
        <Fragment>
          <div id="image" className={imageClassName} ref="image">
            <SelectImages
              images={images}
              selected={url}
              onSelect={this.changeImage}
            />
            <Stage width={width} height={width} onClick={this.handleClick}>
              <Layer width={width} height={width} visible>
                <Image
                  image={image}
                  width={width - imagePadding}
                  height={width - imagePadding}
                />
                {complaints.map((conf, i) => (
                  <ComplaintMarker key={i} index={i} {...conf} {...circle} />
                ))}
                {complaints.map((conf, i) => (
                  <ComplaintIndicator key={i} index={i} {...conf} {...text} />
                ))}
              </Layer>
            </Stage>
          </div>
          <div className={complaintClassName}>
            <Complaints
              complaints={complaints}
              onChange={this.handleTextChange}
              onDelete={this.handleDelete}
            />
          </div>
        </Fragment>
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
        fontSize: 12,
        fontFamily: "Roboto",
        fill: "black",
      },
    },
    imagePadding: 30,
    imageClassName: "col-md-5 col-sm-12",
    complaintClassName: "col-md-7 col-sm-12",
  };

  ComplainImage.propTypes = {
    value: PropTypes.shape({
      url: PropTypes.string.isRequired,
      complaint: PropTypes.arrayOf(
        PropTypes.shape({
          pos: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
          }),
          text: PropTypes.string.isRequired,
        })
      ),
    }),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })
    ).isRequired,
    imagePadding: PropTypes.number,
    imageClassName: PropTypes.string,
    complaintClassName: PropTypes.string,
    complaint: PropTypes.shape({
      radius: PropTypes.number,
      stroke: PropTypes.string,
      strokeWidth: PropTypes.number,
    }),
    onChange: PropTypes.func,
  };

  return ComplainImage;
}
