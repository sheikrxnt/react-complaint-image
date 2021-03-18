import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Image, Layer, Stage } from "react-konva";
import ComplaintMarker from "./ComplaintMarker";
import ComplaintIndicator from "./ComplaintIndicator";
import { setTimeout } from "timers";

export default function(Complaints, SelectImages) {
  class MultipleComplaintImage extends Component {
    constructor(props) {
      super(props);
      let {
        value,
        value: { active } = {} //: { url = props.images[0].url, complaints = [] } = {},
      } = this.props;

      let initVariables = {};
      if (!value || this.isEmpty(value)) {
        initVariables = this.initComplaintsObject();
      }
      let activeKey = active
        ? active
        : this.props.images && this.props.images[0].key;

      this.state = {
        drawingMode: false,
        ...value,
        active: activeKey,
        ...initVariables
      };
      this.changeImage(activeKey, false);
    }

    isEmpty = obj => {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    };

    initComplaintsObject = () => {
      return this.props.images.reduce((agg, item) => {
        let key = item.key;
        agg[key] = {
          complaints: [],
          url: item.url
        };
        return agg;
      }, []);
    };

    changeImage = (active, notifyOnLoad = true) => {
      const image = new window.Image();
      let currentUrl = this.state[active] && this.state[active].url;
      image.src = currentUrl;
      image.onload = () => {
        this.clearDrawings();
        if (notifyOnLoad) {
          this.setState({ image, active }, this.notify);
        } else {
          this.setState({ image, active });
        }
      };
    };

    handleClick = evt => {
      if (!this.state.drawingMode) {
        let {
          currentTarget: { pointerPos },
          target: { className }
        } = evt;
        if (className !== "Image") {
          return;
        }

        this.setState(state => {
          let { active } = state;
          let activeObject = state[active];
          let complaints = activeObject.complaints.concat({ pos: pointerPos });
          let currentWidth = this.currentWidth;
          let updatedItem = {
            [active]: { ...activeObject, complaints },
            srcWidth: currentWidth
          };
          return Object.assign({}, state, updatedItem);
        }, this.notify);
      }
    };

    handleTap = evt => {
      if (!this.state.drawingMode) {
        let {
          currentTarget: { pointerPos },
          target: { className }
        } = evt;
        if (className !== "Image") {
          return;
        }

        this.setState(state => {
          let { active } = state;
          let activeObject = state[active];
          let complaints = activeObject.complaints.concat({ pos: pointerPos });
          let currentWidth = this.currentWidth;
          let updatedItem = {
            [active]: { ...activeObject, complaints },
            srcWidth: currentWidth
          };
          return Object.assign({}, state, updatedItem);
        }, this.notify);
      }
    };

    handleTextChange = (i, text) => {
      this.setState(state => {
        let { active } = state;
        let activeObj = state[active];
        let complaints = activeObj.complaints;
        let complaint = Object.assign({}, complaints[i], { text });
        complaints = complaints.slice();
        complaints.splice(i, 1, complaint);
        let currentWidth = this.currentWidth;
        let updatedItem = {
          [active]: { ...activeObj, complaints },
          srcWidth: currentWidth
        };
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
        let currentWidth = this.currentWidth;
        let updatedItem = {
          [active]: { ...activeObj, complaints },
          srcWidth: currentWidth
        };
        return Object.assign({}, state, updatedItem);
      }, this.notify);
    };

    handleClearAll = () => {
      this.clearDrawings();
      this.setState(state => {
        let { active } = state;
        let activeObj = state[active];
        let updatedItem = {
          [active]: { ...activeObj, complaints: [], drawnPoints: [] }
        };
        return Object.assign({}, state, updatedItem);
      }, this.notify);
    };

    clearDrawings() {
      let image = this.refs.drawinglayer;
      image && image.clear();
    }

    notify = () => {
      /** 
        I believe render is in the call stack and this async operation settimeout sends the function to the webapi.
        Even if the timeout is 0, it does not get added to the call stack until the call stack is empty
        this solves our problem of notify executing before the render function
        or use promise new Promise((event) => setTimeout(event, 10)).then(()=> {
      */

      if (this.state.srcWidth !== undefined) {
        this.setState({
          srcWidth: this.currentWidth
        });
      }

      setTimeout(() => {
        // this is done to prevent passing active and image objects to the onchange event
        let { image, ...values } = this.state;
        let { active } = this.state;
        if (this.props.onChange) {
          let stage = this.refs.stage.getStage();
          values[active] ? (values[active].dataURI = stage.toDataURL()) : null;
          let event = {
            ...values
          };
          this.props.onChange(event);
        }
      }, 0);
    };

    componentWillUpdate(nextProps, nextState) {
      if (this.state.active !== nextState.active) {
        this.updateDrawing = true;
      } else {
        this.updateDrawing = false;
      }
    }

    getDrawnPoints = points => {
      let currentWidth = this.currentWidth;
      if (points && points.length > 0) {
        this.setState(state => {
          let { active } = state;
          let activeObject = state[active];
          let updatedItem = {
            [active]: { ...activeObject, drawnPoints: points },
            srcWidth: currentWidth
          };
          return Object.assign({}, state, updatedItem);
        });
      }
    };

    componentDidMount() {
      let { width } = ReactDOM.findDOMNode(
        this.refs["image-frame"]
      ).getBoundingClientRect();
      let { imagePadding } = this.props;

      this.currentWidth = width;

      this.currentSrcWidth = this.state.srcWidth;

      let stage = this.refs.stage.getStage();
      this.imageSize = width - imagePadding;

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
        markerColors
      } = this.props;
      let { active, image } = this.state;
      let complaints = this.state[active] ? this.state[active].complaints : [];

      let uiDisplay = null;
      let uiOptions = null;
      this.props.images.forEach(item => {
        if (item.key === this.state.active) {
          uiDisplay = item.uiDisplay;
          uiOptions = item.uiOptions;
        }
      });

      return (
        <Fragment>
          <div id="image" className={imageClassName} ref="image-frame">
            <SelectImages
              images={images}
              selected={active}
              onSelect={this.changeImage}
            />
            <div style={{ margin: "3px" }}>
              <a
                className="complaint_image_link"
                style={{
                  left: "1px",
                  zIndex: 1
                }}
                onClick={this.handleClearAll}
              >
                <span
                  style={{ fontSize: "11px" }}
                  className="glyphicon glyphicon-refresh"
                />
                &nbsp;Clear All
              </a>
              <span className="pull-right">
                <label className="radio-inline select-mode-container">
                  <input
                    type="radio"
                    checked={!this.state.drawingMode}
                    onChange={() => {
                      this.setState(() => {
                        return { drawingMode: false };
                      });
                    }}
                  />
                  Selection Mode
                </label>
                <label className="radio-inline draw-mode-container">
                  <input
                    type="radio"
                    checked={this.state.drawingMode}
                    onChange={() => {
                      this.setState(() => {
                        return { drawingMode: true };
                      });
                    }}
                  />
                  Drawing Mode
                </label>
              </span>
            </div>
            <hr />
            <div
              style={{ cursor: this.state.drawingMode ? "cell" : "default" }}
            >
              <Stage
                onClick={this.handleClick}
                onTap={this.handleTap}
                ref="stage"
              >
                <Layer visible ref="layer">
                  <Image ref="image" image={image} />
                  {this.imageSize && !this.updateDrawing && (
                    <Drawing
                      ref="drawinglayer"
                      isDrawingMode={this.state.drawingMode}
                      notifyParent={this.notify}
                      parentImageSize={this.imageSize}
                      getDrawnPoints={points => this.getDrawnPoints(points)}
                      allPoints={this.state[this.state.active]["drawnPoints"]}
                      complaints={this.state[this.state.active]["complaints"]}
                      srcWidth={this.currentSrcWidth}
                      currentWidth={this.currentWidth}
                    />
                  )}
                  {complaints.map((conf, i) => {
                    let stroke = markerColors
                      ? markerColors[i % markerColors.length]
                      : circle.stroke;
                    let markerConf = Object.assign({}, conf, circle, {
                      stroke
                    });
                    return <ComplaintMarker key={i} {...markerConf} />;
                  })}
                  {complaints.map((conf, i) => {
                    let fill = markerColors
                      ? markerColors[i % markerColors.length]
                      : circle.fill;
                    let indicatorConf = Object.assign({}, conf, text, { fill });
                    return (
                      <ComplaintIndicator
                        key={i}
                        index={i}
                        {...indicatorConf}
                      />
                    );
                  })}
                </Layer>
              </Stage>
            </div>
          </div>
          <div className={complaintClassName}>
            <Complaints
              complaints={complaints}
              markerColors={markerColors}
              onChange={this.handleTextChange}
              onDelete={this.handleDelete}
              uiDisplay={uiDisplay}
              uiOptions={uiOptions}
            />
          </div>
        </Fragment>
      );
    }
  }

  MultipleComplaintImage.defaultProps = {
    complaint: {
      circle: {
        radius: 10,
        stroke: "#38A8E8",
        strokeWidth: 2
      },
      text: {
        fontSize: 12,
        fontFamily: "Roboto",
        fill: "black"
      }
    },
    imagePadding: 30,
    imageClassName: "col-md-5 col-sm-12",
    complaintClassName: "col-md-7 col-sm-12"
  };

  MultipleComplaintImage.propTypes = {
    value: PropTypes.shape({
      complaint: PropTypes.arrayOf(
        PropTypes.shape({
          pos: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired
          }),
          text: PropTypes.string.isRequired
        })
      )
    }),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
      })
    ).isRequired,
    imagePadding: PropTypes.number,
    imageClassName: PropTypes.string,
    complaintClassName: PropTypes.string,
    complaint: PropTypes.shape({
      radius: PropTypes.number,
      stroke: PropTypes.string,
      strokeWidth: PropTypes.number
    }),
    markerColors: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func
  };

  return MultipleComplaintImage;
}

/**
 * Class Component the inserts free drawn image of the layer in the stage
 */
class Drawing extends Component {
  state = {
    isDrawing: false,
    currentPoints: [],
    allPoints: []
  };

  /**
   * componentDidMount- creates the canvas element and adds that to local state
   * If points are passed as props, those get drawn when the component loads
   */
  componentDidMount() {
    const canvas = document.createElement("canvas");
    canvas.width = this.props.parentImageSize;
    canvas.height = this.props.parentImageSize;
    const context = canvas.getContext("2d");
    let allPointsArray = [];
    const srcWidth = this.props.srcWidth;
    const currentWidth = this.props.currentWidth;
    if (
      srcWidth &&
      this.currentWidth !== srcWidth &&
      this.props.complaints &&
      this.props.complaints.length > 0
    ) {
      this.props.complaints.forEach(item => {
        let positionX = "";
        let positionY = "";
        positionX = item.pos.x * (currentWidth / srcWidth);
        positionY = item.pos.y * (currentWidth / srcWidth);
        item.pos.x = Math.round(positionX);
        item.pos.y = Math.round(positionY);
      });
    }
    if (this.props.allPoints && this.props.allPoints.length > 0) {
      context.strokeStyle = "#df4b26";
      context.lineJoin = "round";
      context.lineWidth = 1;
      context.beginPath();
      this.props.allPoints.forEach(group => {
        group.forEach((localPos, i) => {
          if (srcWidth && currentWidth !== srcWidth) {
            var positionX = "";
            var positionY = "";
            positionX = localPos.x * (currentWidth / srcWidth);
            positionY = localPos.y * (currentWidth / srcWidth);
            localPos.x = Math.round(positionX);
            localPos.y = Math.round(positionY);
          }
          if (i !== 0) {
            context.lineTo(localPos.x, localPos.y);
          }
          context.moveTo(localPos.x, localPos.y);
        });
        context.closePath();
        context.stroke();
      });
      this.image.getLayer().draw();
      allPointsArray = this.props.allPoints;
    }
    this.setState(() => {
      return { canvas, context, allPoints: allPointsArray };
    }, this.props.notifyParent);
  }

  /**
   * handleMouseDown- Function to handle mouse down operation
   * function sets isDrawing to true and saves the first point to the state
   */
  handleMouseDown = () => {
    if (!this.props.isDrawingMode) {
      return;
    }
    this.setState(
      () => {
        return {
          isDrawing: true
        };
      },
      () => {
        const stage = this.image.parent.parent;
        this.lastPointerPosition = stage.getPointerPosition();
        var localPos = {
          x: this.lastPointerPosition.x - this.image.x(),
          y: this.lastPointerPosition.y - this.image.y()
        };
        let currentPoints = [];
        currentPoints.push(...this.state.currentPoints, localPos);
        this.setState({
          currentPoints: currentPoints
        });
      }
    );
  };

  /**
   * handleMouseUp- This is where isDrawing is set to false, state is updated with
   * the most recent points and parent component is notified
   */
  handleMouseUp = () => {
    if (!this.props.isDrawingMode && !this.state.isDrawing) {
      return;
    }
    if (this.state.currentPoints && this.state.currentPoints.length > 1) {
      let allPoints = [...this.state.allPoints, this.state.currentPoints];
      this.setState({ isDrawing: false, allPoints, currentPoints: [] });
      this.props.getDrawnPoints(allPoints);
    } else {
      this.setState({ isDrawing: false, currentPoints: [] });
    }
    this.props.notifyParent();
  };

  /**
   * clear() is used to clear the drawings
   */
  clear = () => {
    const { context } = this.state;
    context.clearRect(
      0,
      0,
      this.props.parentImageSize,
      this.props.parentImageSize
    );
    this.image.getLayer().draw();
    this.setState({
      allPoints: [],
      currentPoints: []
    });
  };
  /**
   * handleMouseMove- This is where the drawing logic is implemented using context.
   * points are added to the state too
   */
  handleMouseMove = () => {
    const { context, isDrawing } = this.state;
    if (!this.props.isDrawingMode) {
      return;
    }
    if (isDrawing) {
      context.strokeStyle = "#df4b26";
      context.lineJoin = "round";
      context.lineWidth = 1;

      context.globalCompositeOperation = "source-over";
      context.beginPath();

      var localPos = {
        x: this.lastPointerPosition.x - this.image.x(),
        y: this.lastPointerPosition.y - this.image.y()
      };
      context.moveTo(localPos.x, localPos.y);

      const stage = this.image.parent.parent;
      var pos = stage.getPointerPosition();
      localPos = {
        x: pos.x - this.image.x(),
        y: pos.y - this.image.y()
      };
      context.lineTo(localPos.x, localPos.y);
      context.closePath();
      context.stroke();
      this.lastPointerPosition = pos;
      this.image.getLayer().draw();

      let currentPoints = [];
      currentPoints.push(...this.state.currentPoints, localPos);
      this.setState({ currentPoints: currentPoints });
    }
  };

  render() {
    const { canvas } = this.state;
    return (
      <Image
        image={canvas}
        ref={node => (this.image = node)}
        width={this.props.parentImageSize}
        height={this.props.parentImageSize}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseUp}
      />
    );
  }
}
