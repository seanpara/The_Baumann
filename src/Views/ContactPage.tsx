import React, { useReducer, useState, useEffect } from "react";
import { useRecoilState } from "recoil";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { useHomePageStyles } from "../styles";
import { contactState } from "../atoms";

/// typing will be corrected when this is refactored with the new mock ups
const bookingFields = {
  name: "",
  email: "",
  phoneNumber: "",
  description: "",
  date: "",
};

const generalContactFields = {
  name: "",
  email: "",
  message: "",
};

const fieldNameToPlaceholderTextMapping: { [key: string]: string } = {
  name: "Name",
  email: "Email",
  phoneNumber: "Phone Number",
  description: "Description of Booking",
  date: "Desired Date(s)",
  websiteOrSocialMedia: "Website or Social Media Link",
};

const SET_FIELD = "SET_FIELD";
const SET_ALL_FIELDS = "SET_ALL_FIELDS";

const RESET_FORM = "RESET_FORM";

interface FormState {
  [key: string]: string | number | null;
}

const ContactPage = () => {
  const [formState, dispatchFormAction] = useReducer(
    (state: FormState, { type, payload }: { type: string; payload?: any }) => {
      switch (type) {
        case SET_FIELD: {
          const { field = "", value = "" } = payload;
          return { ...state, [field]: value };
        }
        case SET_ALL_FIELDS: {
          return payload;
        }
        case RESET_FORM:
          return generalContactFields;
        default:
          return state;
      }
    },
    generalContactFields
  );
  const [errorMessage, setErrorMessage] = useState("");

  const classes = useHomePageStyles();

  const [contactType] = useRecoilState(contactState);

  useEffect(() => {
    if (contactType) {
      dispatchFormAction({
        type: SET_ALL_FIELDS,
        payload:
          contactType === "general" ? generalContactFields : bookingFields,
      });
    }
  }, [contactType]);

  const makeASentence = (word: string): string =>
    word.replace(/^[a-z]|[A-Z]/g, (v, i) =>
      i === 0 ? v.toUpperCase() : " " + v.toLowerCase()
    );

  const handleFieldChange = ({ target: { value } }: any, field: any) =>
    dispatchFormAction({
      type: SET_FIELD,
      payload: { field, value },
    });

  const handleFormSubmit = async () => {
    dispatchFormAction({ type: RESET_FORM });

    const { status, error } = await fetch(
      "https://us-central1-baumann-firebase.cloudfunctions.net/sendMail",
      {
        method: "POST",
        body: JSON.stringify(formState),
      }
    ).then((r): Promise<{ status: number; error: string }> => r.json());

    if (status !== 200) {
      setErrorMessage(error);
    }
  };

  const renderFormField = (stateKey: string): JSX.Element => (
    <TextField
      key={stateKey}
      required={stateKey === "name" || stateKey === "email"}
      style={{
        width: "80%",
        backgroundColor: "white",
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
    <div className={classes.contactPage}>
      <h1>
        {contactType === "booking" ? "Book with Us!" : "Send Us a Message!"}
      </h1>
      {renderForm()}
      <Button
        disabled={!name || !email}
        onClick={handleFormSubmit}
        variant="contained"
        style={{ width: "40%", marginTop: "5%" }}
      >
        Submit
      </Button>
    </div>
  );
};

export default ContactPage;
