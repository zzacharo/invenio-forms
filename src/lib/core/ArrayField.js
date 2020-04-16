import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn, FieldArray } from 'formik';
import { Form, Button, Icon } from 'semantic-ui-react';

export class ArrayField extends Component {
  renderFormField = formikBag => {
    const {
      form: { values },
      ...arrayHelpers
    } = formikBag;
    const {
      // ArrayField specific props
      addButtonLabel,
      defaultNewValue,
      fieldPath,
      label,
      renderArrayItem,
      // Other semantic-ui or HTML props
      ...uiProps
    } = this.props;

    return (
      <Form.Field {...uiProps}>
        <label htmlFor={fieldPath}>{label}</label>
        {getIn(values, fieldPath, []).map((value, index) => {
          return (
            <div key={`${fieldPath}.${index}`}>
              {renderArrayItem({ fieldPath, index, ...formikBag })}
            </div>
          );
        })}
        <Button
          basic
          secondary
          type="button"
          onClick={() => arrayHelpers.push(defaultNewValue)}
        >
          <Icon name="add" />
          {addButtonLabel}
        </Button>
      </Form.Field>
    );
  };

  render() {
    return (
      <FieldArray
        name={this.props.fieldPath}
        component={this.renderFormField}
      />
    );
  }
}

ArrayField.propTypes = {
  addButtonLabel: PropTypes.string,
  defaultNewValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  renderArrayItem: PropTypes.func.isRequired,
};

ArrayField.defaultProps = {
  addButtonLabel: 'Add new row',
  label: '',
  placeholder: '',
};
