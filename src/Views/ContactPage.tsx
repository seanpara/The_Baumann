import React, { useReducer, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';

import { useHomePageStyles } from '../styles';
import { TextareaAutosize } from '@material-ui/core';

/// typing will be corrected when this is refactored with the new mock ups
const intialFormState = {
  name: '',
  email: '',
  phoneNumber: '',
  websiteOrSocialMedia: '',
  useOfSpace: '',
  message: '',
};

const fieldNameToPlaceholderTextMapping: { [key: string]: string } = {
  name: 'Name',
  email: 'Email',
  phoneNumber: 'Phone Number',
  websiteOrSocialMedia: 'Website or Social Media Link',
};

const SET_FIELD = 'SET_FIELD';
const RESET_FORM = 'RESET_FORM';

const ContactPage = () => {
  const [formState, dispatchFormAction] = useReducer(
    (state: any, { type, payload: { field = '', value = '' } = {} }: any) => {
      switch (type) {
        case SET_FIELD:
          return { ...state, [field]: value };
        case RESET_FORM:
          return intialFormState;
        default:
          return state;
      }
    },
    intialFormState,
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingType, setBookingType] = useState('');

  const classes = useHomePageStyles();

  const handleFieldChange = ({ target: { value } }: any, field: any) =>
    // @ts-ignore
    dispatchFormAction({
      type: SET_FIELD,
      payload: { field, value },
    });

  const handleFormSubmit = async () => {
    // @ts-ignore
    dispatchFormAction({ type: RESET_FORM });

    const res = await fetch(
      'https://us-central1-baumann-firebase.cloudfunctions.net/sendMail',
      {
        method: 'POST',
        body: JSON.stringify(formState),
      },
    );
    // @ts-ignore
    const { status, error } = res.json();
    if (status !== 200) {
      setErrorMessage(error);
    }
  };

  const renderFormField = (stateKey: string): JSX.Element => {
    if (stateKey === 'useOfSpace') {
      return (
        <div
          key={stateKey}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-apart',
            width: '80%',
          }}
        >
          <FormHelperText>How Would You Like to Use our Space?</FormHelperText>
          <Select
            variant="filled"
            value={formState[stateKey]}
            onChange={(e): void => {
              handleFieldChange(e, stateKey);
              setBookingType(e.target.value as string);
            }}
          >
            <MenuItem value={'event'}>Event</MenuItem>
            <MenuItem value={'rental'}>Rental</MenuItem>
            <MenuItem value={'both'}>Both</MenuItem>
          </Select>
        </div>
      );
    }

    if (stateKey === 'message') {
      return (
        <TextareaAutosize
          onChange={(e) => handleFieldChange(e, stateKey)}
          placeholder="Enter a Message Here"
        />
      );
    }

    return (
      <TextField
        key={stateKey}
        required={stateKey === 'name' || stateKey === 'email'}
        style={{
          width: '80%',
        }}
        variant="filled"
        label={fieldNameToPlaceholderTextMapping[stateKey]}
        value={formState[stateKey]}
        onChange={(e) => handleFieldChange(e, stateKey)}
        error={Boolean(errorMessage)}
        helperText={errorMessage}
      />
    );
  };

  const renderForm = (): JSX.Element[] =>
    Object.keys(formState).map(renderFormField);

  const { name, email } = formState;
  return (
    <div
      className={classes.root}
      style={{
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <h1>Book with Us!</h1>
      {renderForm()}
      <Button
        disabled={!name || !email}
        onClick={handleFormSubmit}
        variant="contained"
        style={{ width: '40%' }}
      >
        Submit
      </Button>
    </div>
  );
};

export default ContactPage;
