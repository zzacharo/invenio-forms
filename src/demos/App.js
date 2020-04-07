import React, { Component } from "react";
import { getIn } from "formik";
import isEmpty from "lodash/isEmpty";
import * as Yup from "yup";
import { Header, Message, Container } from "semantic-ui-react";

import { InvenioForm } from "../lib/core/InvenioForm";
import { TextField, YearInputField } from "../lib/core";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {},
      errors: {},
    };
  }

  submitSerializer = (values) => {
    const { _submitButton, ...rawValues } = values;
    const newRecord = this.props.pid ? false : true;
    const serializedValues = this.props.submitSerializer
      ? this.props.submitSerializer(rawValues, newRecord)
      : { ...rawValues };
    return [serializedValues, _submitButton];
  };

  initialValues = {
    title: "",
    year: "",
  };

  MyFormSchema = Yup.object().shape({
    title: Yup.string().min(10).required(),
  });

  validate = (values) => {
    const errors = {};

    if (!values.title) {
      errors.title = "Required";
    }
    return errors;
  };

  onSubmit = (values) => {
    this.setState({ record: values });
  };

  onError = (error) => {
    console.log(error);

    let payload = {};
    const errors = getIn(error, "response.data.errors", []);

    if (isEmpty(errors)) {
      const message = getIn(error, "response.data.message", null);
      if (message) {
        payload = { message };
      } else {
        throw error;
      }
    } else {
      const errorData = error.response.data;
      for (const fieldError of errorData.errors) {
        payload[fieldError.field] = fieldError.message;
      }
    }
    return payload;
  };

  render() {
    return (
      <Container>
        <InvenioForm
          onSubmit={this.onSubmit}
          onError={this.onError}
          formik={{
            initialValues: this.initialValues,
            validationSchema: this.MyFormSchema,
          }}
        >
          <Header textAlign="center">My Form</Header>
          <TextField
            fieldPath="title"
            placeholder="Enter a new title"
            label="Title"
            fluid="true"
            required
          />
          <YearInputField fieldPath="year" label="Year" optimized />
        </InvenioForm>
        <Message>
          <Message.Header>Submitted record</Message.Header>
          <pre>{JSON.stringify(this.state.record)}</pre>
        </Message>
      </Container>
    );
  }
}

export default App;
