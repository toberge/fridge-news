// @flow

import * as React from 'react';
import { Component } from 'react-simplified';

class FormSubmit extends Component<{
  disabled: boolean,
  children?: React.Node
}> {
  render() {
    return (
      <button type="submit" className="btn btn-primary" disabled={this.props.disabled}>
        {this.props.children}
      </button>
    );
  }
}

class FormInput extends Component<{
  type?: string,
  name: string,
  label: string,
  placeholder: string,
  value: string,
  onChange: (SyntheticInputEvent<HTMLInputElement>) => void,
  required?: boolean
}> {
  render() {
    return (
      <div className="form-group">
        <label htmlFor={this.props.name} className="form-label">
          {this.props.label}
        </label>
        <input
          id={this.props.name}
          className="form-control"
          placeholder={this.props.placeholder}
          type={this.props.type ? this.props.type : 'text'}
          value={this.props.value}
          onChange={this.props.onChange}
          required={this.props.required}
        />
      </div>
    );
  }
}

class FormInputRow extends Component<{
  type?: string,
  name: string,
  label: string,
  placeholder: string,
  helpText: string | React.Node,
  value: string,
  onChange: (SyntheticInputEvent<HTMLInputElement>) => void,
  required?: boolean,
  labelCols?: number,
  inputCols?: number
}> {
  render() {
    return (
      <div className="row">
        <label htmlFor={this.props.name} className={`col${this.props.labelCols ? '-' + this.props.labelCols : ''} col-form-label`}>
          {this.props.label}
        </label>
        <div className={`col-${this.props.inputCols ? this.props.inputCols : 10}`}>
          <input
            id={this.props.name}
            aria-describedby={`${this.props.name}Help`}
            className="form-control"
            placeholder={this.props.placeholder}
            type={this.props.type ? this.props.type : 'text'}
            value={this.props.value}
            onChange={this.props.onChange}
            required={this.props.required}
          />
          <small id={`${this.props.name}Help`} className="form-text text-muted">
            {this.props.helpText}
          </small>
        </div>
      </div>
    );
  }
}

class FormGroup extends Component<{ children: React.Node }> {
  render() {
    return <div className="form-group">{this.props.children}</div>;
  }
}

export default class Form extends Component<{ children: React.Node }> {
  static Input = FormInputRow;
  static Group = FormGroup;
  static Submit = FormSubmit;

  render() {
    return <form>{this.props.children}</form>;
  }
}
