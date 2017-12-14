import React, { Component, Fragment } from "react";

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
      <Fragment>
        <td>
          <input
            autoFocus={true}
            type="text"
            value={this.state.value}
            className="form-control"
            onKeyDown={this.handleKeyDown}
            onBlur={this.handleSubmit}
            onChange={this.handleChange}
          />
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

export default function ComplaintText({ complaints, onChange, onDelete }) {
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
              />
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}
