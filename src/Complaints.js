import React, { Component } from "react";

class Complaint extends Component {
  constructor(props) {
    super(props);

    let { text = "" } = props;

    this.state = { value: text };
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
      <input
        autoFocus={true}
        type="text"
        value={this.state.value}
        className="form-control"
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleSubmit}
        onChange={this.handleChange}
      />
    );
  }
}

export default function ComplaintText({ complaints, onChange }) {
  return (
    <ol>
      {complaints.map((complaint, i) => (
        <li key={i}>
          <Complaint {...complaint} onChange={text => onChange(i, text)} />
        </li>
      ))}
    </ol>
  );
}
