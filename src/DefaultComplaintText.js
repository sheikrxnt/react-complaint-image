import React, { Component } from "react";

class Complaint extends Component {
  constructor(props) {
    super(props);

    let { text = "" } = props;

    this.state = { value: text };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.props.text) {
      let { text = "" } = nextProps;

      this.setState({ value: text });
    }
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.onChange(this.state.value);
  };

  handleKeyDown = event => {
    if (event.keyCode === 13) {
      this.handleSubmit(event);
    }
  };

  render() {
    return (
      <div>
        <input
          autoFocus={true}
          type="text"
          value={this.state.value}
          className="form-control"
          onKeyDown={this.handleKeyDown}
          onBlur={this.handleSubmit}
          onChange={this.handleChange}
        />
        <button className="btn btn-default" onClick={this.props.onDelete}>
          Delete
        </button>
      </div>
    );
  }
}

export default function ComplaintText({ complaints, onChange, onDelete }) {
  return (
    <ol>
      {complaints.map((complaint, i) => (
        <li key={i} className="col-md-12">
          <Complaint
            {...complaint}
            onChange={text => onChange(i, text)}
            onDelete={() => onDelete(i)}
          />
        </li>
      ))}
    </ol>
  );
}
