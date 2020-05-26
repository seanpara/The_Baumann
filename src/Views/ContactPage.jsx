import React, { useReducer } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';

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
const formReducer = (state, { type, payload }) => {
  switch (type) {
    case SET_FIELD:
      console.log(payload);

      return { ...state, [payload.field]: payload.value };
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

  const handleFieldChange = ({ target: { value } }, field) =>
    // @ts-ignore
    dispatchFormAction({
      type: SET_FIELD,
      payload: { field, value },
    });

  const handleFormSubmit = () => {
    fetch('https://us-central1-baumann-firebase.cloudfunctions.net/sendMail', {
      method: 'POST',
      body: JSON.stringify(formState),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error(res.json().error);
        }
      })
      .then((r) => {
        console.log(r);
        // @ts-ignore
        dispatchFormAction({ type: RESET_FORM });
      });
  };

  const classes = useHomePageStyles();
  const { name, email, website, source, message } = formState;
  console.log('Form state:', formState);

  return (
    <div className={classes.root} style={{ height: '100vh' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '50%',
          justifyContent: 'space-between',
        }}
      >
        <TextField
          required
          label="Name"
          value={name}
          onChange={(e) => handleFieldChange(e, 'name')}
        />
        <TextField
          required
          label="Email"
          value={email}
          onChange={(e) => handleFieldChange(e, 'email')}
        />
        <TextField
          label="Website"
          value={website}
          onChange={(e) => handleFieldChange(e, 'website')}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '20%',
            justifyContent: 'space-apart',
          }}
        >
          <FormHelperText>How Did you here about us?</FormHelperText>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={source}
            onChange={(e) => handleFieldChange(e, 'source')}
          >
            <MenuItem value={'friend'}>Friend</MenuItem>
            <MenuItem value={'online'}>Online</MenuItem>
          </Select>
        </div>

        <TextField
          label="Message"
          value={message}
          onChange={(e) => handleFieldChange(e, 'message')}
        />
        <Button
          onClick={handleFormSubmit}
          variant="contained"
          color="primary"
          disabled={!name || !email}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ContactPage;
