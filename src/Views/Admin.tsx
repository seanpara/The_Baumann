import React, { useState, useEffect } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase, { User } from "firebase";

import { firebaseConfig } from "../firebaseConfig";
import { Divider } from "@material-ui/core";
firebase.initializeApp(firebaseConfig);

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

const AdminView = (): JSX.Element => {
  const [authData, setAuthData] = useState({
    isSignedIn: false,
    isValid: false,
  }); // Local signed-in state.

  const validateUser = async (user: User | null): Promise<void> => {
    const { isValid } = await fetch(
      "https://us-central1-baumann-firebase.cloudfunctions.net/validateUser",
      {
        method: "POST",
        body: JSON.stringify(user?.uid),
      }
    ).then((r) => r.json());
    if (isValid) {
      setAuthData({ isSignedIn: true, isValid: true });
    } else {
      setAuthData({ isSignedIn: true, isValid: false });
    }
  };
  const { isSignedIn, isValid } = authData;
  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user: User | null) => {
        validateUser(user);
      });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return (
    <div>
      {isSignedIn && isValid && (
        <>
          <h1>You Are Signed In!</h1>
          <button
            onClick={() => {
              setAuthData({ isSignedIn: false, isValid: false });
              firebase.auth().signOut();
            }}
          >
            Sign-out
          </button>
        </>
      )}
      {!isSignedIn && !isValid && (
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      )}
      {isSignedIn && !isValid && (
        <h1>
          You Have Signed in But Aren't Registed, Please Contact Sean Para for
          Admin Privileges{" "}
        </h1>
      )}
    </div>
  );
};

export default AdminView;
