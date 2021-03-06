import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { observer } from 'mobx-react';
import Parser from '../Parser';
import styles from './styles.pcss';
import BaseInput from '../BaseInput';
import WebformElement from '../WebformElement';

@observer
@CSSModules(styles, { allowMultiple: true })
class Input extends Component {
  static propTypes = {
    field: PropTypes.shape({
      '#type': PropTypes.string.isRequired,
      '#placeholder': PropTypes.string,
      '#field_prefix': PropTypes.string,
      '#field_suffix': PropTypes.string,
      '#webform_key': PropTypes.string.isRequired,
      '#required': PropTypes.bool,
      '#mask': PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
      ]),
      '#alwaysShowMask': PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
      ]),
      '#min': PropTypes.string,
      '#max': PropTypes.string,
      '#step': PropTypes.string,
      '#attributes': PropTypes.oneOfType([
        PropTypes.shape({
          autoComplete: PropTypes.string,
        }),
        PropTypes.array,
      ]),
    }).isRequired,
    webformElement: PropTypes.instanceOf(WebformElement).isRequired,
  };

  getLabelClass() {
    const labelClass = this.props.webformElement.getLabelClass();
    if(styles[labelClass]) {
      return labelClass;
    }
    return '';
  }

  renderTextContent(selector) {
    const value = this.props.field[`#field_${selector}`];
    if(value) {
      const className = `${styles[selector] ? selector : ''}`;

      return (<span styleName={className}>{Parser(value)}</span>);
    }
    return '';
  }

  render() {
    return (<div>
      <div styleName={`input-wrap ${this.getLabelClass()}`}>
        <div styleName='input-inner-wrapper'>
          { this.renderTextContent('prefix') }
          <BaseInput
            {...this.props}
            field={this.props.field}
          />
          { this.renderTextContent('suffix') }
        </div>
      </div>
      <span styleName={`validation-icon ${this.props.webformElement.isSuccess() ? 'validate-success' : ''}`} />
    </div>);
  }
}

export default Input;
