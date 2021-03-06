import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import getNested from 'get-nested';
import Parser from '../Parser';
import WebformElement from '../WebformElement';
import styles from './styles.pcss';
import Field from '../Observables/Field';

@CSSModules(styles, { allowMultiple: true })
class RadioField extends Component {
  static meta = {
    wrapper: <fieldset />,
    label: <legend />,
  };

  static propTypes = {
    field: PropTypes.shape({
      '#required': PropTypes.bool,
      '#options': PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.node,
        text: PropTypes.node,
      })),
      '#webform_key': PropTypes.string.isRequired,
      '#title_display': PropTypes.string,
      '#options_display': PropTypes.string,
    }).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]).isRequired,
    webformElement: PropTypes.instanceOf(WebformElement).isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    state: PropTypes.instanceOf(Field).isRequired,
  };

  getOptionPositionClass() {
    const optionClass = `radio-display-${this.props.field['#options_display']}`;
    if(styles[optionClass]) {
      return optionClass;
    }
    return '';
  }

  getLabelPositionClass() {
    const labelClass = `display-${this.props.field['#title_display']}`;
    if(styles[labelClass]) {
      return labelClass;
    }
    return '';
  }

  render() {
    const cssClassesWrapper = `input-wrapper ${this.getLabelPositionClass()}`;
    const cssClassesRadio = `radio-label ${this.getOptionPositionClass()}`;

    const wrapperAttrs = {
      'aria-invalid': this.props.webformElement.isValid() ? null : true,
      'aria-required': this.props.field['#required'] ? true : null,
    };

    return (
      <div styleName={cssClassesWrapper} role='radiogroup' {...wrapperAttrs}>
        {
          getNested(() => this.props.field['#options'], []).map((option, index) => {
            const labelKey = `${this.props.field['#webform_key']}_${index}`;
            return (
              <label key={option.value} styleName={cssClassesRadio} htmlFor={labelKey}>
                <input
                  type='radio'
                  onChange={this.props.onChange}
                  onBlur={this.props.onBlur}
                  value={option.value}
                  name={this.props.field['#webform_key']}
                  styleName='radio'
                  id={labelKey}
                  disabled={!this.props.state.enabled}
                  checked={this.props.value === option.value.toString()}
                />
                <span styleName='indicator' />
                { Parser(option.text) }
              </label>
            );
          })
        }
      </div>
    );
  }
}

export default RadioField;
