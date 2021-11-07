import React, { useReducer, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useHistory } from "react-router-dom";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

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
  const history = useHistory();
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

    const r = await fetch(
      "https://us-central1-baumann-firebase.cloudfunctions.net/sendMail",
      // "http://localhost:5001/baumann-firebase/us-central1/sendMail",
      {
        method: "POST",
        body: JSON.stringify(formState),
      }
    );
    const { message } = await r.json();
    if (r.status !== 200) {
      setErrorMessage(message);
    } else {
      setIsDialogOpen(true);
    }
  };

  const renderFormField = (stateKey: string): JSX.Element => (
    <TextField
      key={stateKey}
      required={stateKey === "name" || stateKey === "email"}
      style={{
        width: "80%",
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
      <div style={{ fontSize: "40px", margin: "2% 0%", fontWeight: "bold" }}>
        {contactType === "booking" ? "Book with Us!" : "Send Us a Message!"}
      </div>
      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
      >
        <DialogTitle>{"Thank you for contacting the Baumann!"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We've received your message and will be in touch within 48 hours
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              history.push("/");
            }}
          >
            Go Back to the Main Page
          </Button>
        </DialogActions>
      </Dialog>
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
