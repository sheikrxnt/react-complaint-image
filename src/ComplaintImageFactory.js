import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Image, Layer, Stage } from "react-konva";
import ComplaintMarker from "./ComplaintMarker";
import ComplaintIndicator from "./ComplaintIndicator";
import { setTimeout } from "timers";

export default function(Complaints, SelectImages) {
  class ComplainImage extends Component {
    constructor(props) {
      super(props);

      let {
        value: { url = props.images[0].url, complaints = [] } = {},
      } = this.props;

      this.state = { url, complaints };
      this.changeImage(url, false);
    }

    changeImage = (url, notifyOnLoad = true) => {
      const image = new window.Image();
      image.src = url;
      image.onload = () => {
        if (notifyOnLoad) {
          this.setState({ image, url, complaints: [] }, this.notify);
        } else {
          this.setState({ image, url });
        }
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
      /** 
        I believe render is in the call stack and this async operation settimeout sends the function to the webapi.
        Even if the timeout is 0, it does not get added to the call stack until the call stack is empty
        this solves our problem of notify executing before the render function
        or use promise new Promise((event) => setTimeout(event, 10)).then(()=> {
      */
      setTimeout(() => {
        if (this.props.onChange) {
          let stage = this.refs.stage.getStage();
          let event = {
            url: this.state.url,
            complaints: this.state.complaints,
            dataURI: stage.toDataURL(),
          };
          this.props.onChange(event);
        }
      }, 0);
    };

    componentDidMount() {
      let { width } = ReactDOM.findDOMNode(
        this.refs["image-frame"]
      ).getBoundingClientRect();
      let { imagePadding } = this.props;

      let stage = this.refs.stage.getStage();

      stage.width(width);
      stage.height(width);

      let image = this.refs.image;
      image.width(width - imagePadding);
      image.height(width - imagePadding);
    }

    render() {
      let {
        images,
        complaint: { circle, text },
        imageClassName,
        complaintClassName,
        markerColors,
      } = this.props;
      let { url, image, complaints } = this.state;

      return (
        <Fragment>
          <div id="image" className={imageClassName} ref="image-frame">
            <SelectImages
              images={images}
              selected={url}
              onSelect={this.changeImage}
            />
            <Stage
              onClick={this.handleClick}
              ref="stage">
              <Layer visible ref="layer">
                <Image ref="image" image={image} />
                {complaints.map((conf, i) => {
                  let stroke = markerColors
                    ? markerColors[i % markerColors.length]
                    : circle.stroke;
                  let markerConf = Object.assign({}, conf, circle, { stroke });
                  return <ComplaintMarker key={i} {...markerConf} />;
                })}
                {complaints.map((conf, i) => {
                  let fill = markerColors
                    ? markerColors[i % markerColors.length]
                    : circle.fill;
                  let indicatorConf = Object.assign({}, conf, text, { fill });
                  return (
                    <ComplaintIndicator key={i} index={i} {...indicatorConf} />
                  );
                })}
              </Layer>
            </Stage>
          </div>
          <div className={complaintClassName}>
            <Complaints
              complaints={complaints}
              markerColors={markerColors}
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
    markerColors: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
  };

  return ComplainImage;
}
