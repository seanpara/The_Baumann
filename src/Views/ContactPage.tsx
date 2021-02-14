import React, { useReducer, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';

import { useHomePageStyles } from '../styles';

/// typing will be corrected when this is refactored with the new mock ups
const intialFormState = {
  name: '',
  email: '',
  phoneNumber: '',
  description: '',
  estimatedAttendance: null,
  date: '',
};
// Event App:

// 1. Description of event*
// 2. Estimated attendance*
// 3. Desired date(s) of event*
// 4. Estimated duration of event
// 5. Technical requirements
// 6. Additional details, comments, questions

// Rental App:

// 1. Description of rehearsal/use*
// 2. Number in party*
// 3. Date(s

// const fieldNameToPlaceholderTextMapping: { [key: string]: string | number } = {
//   name: 'Name',
//   email: 'Email',
//   phoneNumber: 'Phone Number',
//   description: '',
//   date: '',
// };

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
    (state: any, { type, payload }: any) => {
      switch (type) {
        case SET_FIELD: {
          const { field = '', value = '' } = payload;
          return { ...state, [field]: value };
        }
        case RESET_FORM:
          return intialFormState;
        default:
          return state;
      }
    },
    intialFormState,
  );
  const [errorMessage, setErrorMessage] = useState('');

  const classes = useHomePageStyles();

  const makeASentence = (word: string): string =>
    word.replace(/^[a-z]|[A-Z]/g, (v, i) =>
      i === 0 ? v.toUpperCase() : ' ' + v.toLowerCase(),
    );

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

  const renderFormField = (stateKey: string): JSX.Element => (
    <TextField
      key={stateKey}
      required={stateKey === 'name' || stateKey === 'email'}
      style={{
        width: '80%',
      }}
      variant="filled"
      label={
        fieldNameToPlaceholderTextMapping[stateKey] ?? makeASentence(stateKey)
      }
      value={formState[stateKey]}
      onChange={(e) => handleFieldChange(e, stateKey)}
      error={Boolean(errorMessage)}
      helperText={errorMessage}
    />
  );

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
