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
        value,
        value: { active }, //: { url = props.images[0].url, complaints = [] } = {},
      } = this.props;

      this.state = { ...value };
      this.changeImage(active, false);
    }

    changeImage = (active, notifyOnLoad = true) => {
      const image = new window.Image();
      let currentUrl = this.state[active].url;
      image.src = currentUrl;
      image.onload = () => {
        if (notifyOnLoad) {
          this.setState({ image, active }, this.notify);
        } else {
          this.setState({ image, active });
        }
      };
    };

    handleClick = evt => {
      let { currentTarget: { pointerPos }, target: { className } } = evt;
      if (className !== "Image") {
        return;
      }

      this.setState(state => {
        let { active } = state;
        let activeObject = state[active];
        let complaints = activeObject.complaints.concat({ pos: pointerPos });
        let updatedItem = { [active]: { ...activeObject, complaints } };
        return Object.assign({}, state, updatedItem);
      }, this.notify);
    };

    handleTap = evt => {
      let { currentTarget: { pointerPos }, target: { className } } = evt;
      if (className !== "Image") {
        return;
      }

      this.setState(state => {
        let { active } = state;
        let activeObject = state[active];
        let complaints = activeObject.complaints.concat({ pos: pointerPos });
        let updatedItem = { [active]: { ...activeObject, complaints } };
        return Object.assign({}, state, updatedItem);
      }, this.notify);
    };

    handleTextChange = (i, text) => {
      this.setState(state => {
        let { active } = state;
        let activeObj = state[active];
        let complaints = activeObj.complaints;
        let complaint = Object.assign({}, complaints[i], { text });
        complaints = complaints.slice();
        complaints.splice(i, 1, complaint);

        let updatedItem = { [active]: { ...activeObj, complaints } };
        return Object.assign({}, state, updatedItem);
      }, this.notify);
    };

    handleDelete = i => {
      this.setState(state => {
        let { active } = state;
        let activeObj = state[active];
        let complaints = activeObj.complaints;
        complaints = complaints.slice();
        complaints.splice(i, 1);
        let updatedItem = { [active]: { ...activeObj, complaints } };
        return Object.assign({}, state, updatedItem);
      }, this.notify);
    };

    handleClearAll = () => {
      this.setState(state => {
        let { active } = state;
        let activeObj = state[active];
        let updatedItem = { [active]: { ...activeObj, complaints: [] } };
        return Object.assign({}, state, updatedItem);
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
        // this is done to prevent passing active and image objects to the onchange event
        let { active, image, ...values } = this.state;
        if (this.props.onChange) {
          let stage = this.refs.stage.getStage();
          values[active] ? (values[active].dataURI = stage.toDataURL()) : null;
          let event = {
            ...values,
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
      let { active, image } = this.state;
      let complaints = this.state[active].complaints;

      return (
        <Fragment>
          <div id="image" className={imageClassName} ref="image-frame">
            <SelectImages
              images={images}
              selected={active}
              onSelect={this.changeImage}
            />
            <div>
              <a
                className="btn"
                style={{
                  position: "absolute",
                  left: "1px",
                  padding: "2px",
                  zIndex: 1,
                  fontSize: "10px",
                  color: "red",
                }}
                onClick={this.handleClearAll}>
                <span
                  style={{ fontSize: "10px" }}
                  className="glyphicon glyphicon-refresh"
                />
                &nbsp;Clear All
              </a>
            </div>
            <Stage
              onClick={this.handleClick}
              onTap={this.handleTap}
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
