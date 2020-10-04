import React, { useReducer, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import { useHomePageStyles } from '../styles';

const intialFormState = {
  name: '',
  email: '',
  website: '',
  source: '',
  message: '',
};

const SET_FIELD = 'SET_FIELD';
const RESET_FORM = 'RESET_FORM';
const formReducer = (
  state,
  { type, payload: { field = '', value = '' } = {} },
) => {
  switch (type) {
    case SET_FIELD:
      return { ...state, [field]: value };
    case RESET_FORM:
      return intialFormState;
    default:
      return state;
  }
};

const ContactPage = () => {
  const [formState, dispatchFormAction] = useReducer(
    formReducer,
    intialFormState,
  );
  const [errorMessage, setErrorMessage] = useState('');
  const classes = useHomePageStyles();

  const handleFieldChange = ({ target: { value } }, field) =>
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
    const { status, error } = res.json();
    if (status !== 200) {
      setErrorMessage(error);
    }
  };

  const renderForm = () =>
    Object.keys(formState).map((stateKey) =>
      stateKey !== 'source' ? (
        <TextField
          key={stateKey}
          required={stateKey === 'name' || stateKey === 'email'}
          label={stateKey.charAt(0).toUpperCase() + stateKey.slice(1)}
          value={formState[stateKey]}
          onChange={(e) => handleFieldChange(e, stateKey)}
          error={Boolean(errorMessage)}
          helperText={errorMessage}
        />
      ) : (
        <div
          key={stateKey}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '20%',
            justifyContent: 'space-apart',
          }}
        >
          <FormHelperText>How Did you hear about us?</FormHelperText>
          <Select
            value={formState[stateKey]}
            onChange={(e) => handleFieldChange(e, stateKey)}
          >
            <MenuItem value={'friend'}>Friend</MenuItem>
            <MenuItem value={'online'}>Online</MenuItem>
          </Select>
        </div>
      ),
    );
  const { name, email } = formState;
  return (
    <div
      className={classes.root}
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      <h1
        style={{
          fontFamily: 'serif',
        }}
      >
        Please contact us with questions or if you would like to get involved!
      </h1>
      <Paper
        elevation={4}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '50%',
          width: '60%',
          justifyContent: 'space-between',
          backgroundColor: 'grey',
        }}
      >
        {renderForm()}
        <Button
          onClick={handleFormSubmit}
          variant="contained"
          style={{ backgroundColor: '#0d47a1' }}
          disabled={!name || !email}
        >
          Submit
        </Button>
      </Paper>
    </div>
  );
};

export default ContactPage;
