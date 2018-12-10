import React, { Component, Fragment } from "react";
import { Typeahead } from "react-bootstrap-typeahead";

class Complaint extends Component {
  constructor(props) {
    super(props);

    let { text = "" } = props;
    this.state = {
      value: text,
      typeaheadValue: text ? text.split(" & ") : [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.text !== prevState.text) {
      return {
        text: nextProps.text,
      };
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.text !== this.props.text) {
      this.setState({
        value: this.props.text,
        typeaheadValue: this.props.text ? this.props.text.split(" & ") : [],
      });
    }
  }

  handleTypeaheadChange = items => {
    let selectedValues = items.map(item =>
      typeof item === "object" ? item.label : item
    );
    this.setState({ typeaheadValue: selectedValues });
    this.props.onChange(selectedValues.join(" & "));
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.value !== this.props.text) {
      this.props.onChange(this.state.value);
    }
  };

  handleKeyDown = event => {
    if (event.keyCode === 13) {
      this.handleSubmit(event);
    }
  };

  render() {
    return (
      <Fragment>
        <td>
          {this.props.uiDisplay == "typeahead" && this.props.uiOptions ? (
            <Typeahead
              selected={this.state.typeaheadValue}
              onChange={this.handleTypeaheadChange}
              placeholder="Choose an item..."
              autoFocus={true}
              {...this.props.uiOptions}
            />
          ) : (
            <input
              autoFocus={true}
              type="text"
              value={this.state.value}
              className="form-control"
              onKeyDown={this.handleKeyDown}
              onBlur={this.handleSubmit}
              onChange={this.handleChange}
            />
          )}
        </td>
        <td>
          <button className="btn btn-default" onClick={this.props.onDelete}>
            Delete
          </button>
        </td>
      </Fragment>
    );
  }
}

export default function ComplaintText({
  complaints,
  onChange,
  onDelete,
  uiDisplay,
  uiOptions,
}) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th className="col-md-1">#</th>
          <th>Complaint</th>
          <th className="col-md-1" />
        </tr>
      </thead>
      <tbody>
        {complaints.map((complaint, i) => (
          <Fragment key={i}>
            <tr>
              <td style={{ paddingTop: 14 }}>{i + 1}</td>
              <Complaint
                {...complaint}
                onChange={text => onChange(i, text)}
                onDelete={() => onDelete(i)}
                uiDisplay={uiDisplay}
                uiOptions={{
                  ...uiOptions,
                  autoFocus:
                    uiOptions &&
                    uiOptions.autoFocus &&
                    complaints.length - 1 === i &&
                    complaint.text === undefined,
                }}
              />
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}
