import React, { useState, useEffect } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase, { User } from "firebase";

import { firebaseConfig } from "../firebaseConfig";
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
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  const validateUser = async (user: User | null): Promise<void> => {
    const { isValid } = await fetch(
      "https://us-central1-baumann-firebase.cloudfunctions.net/validateUser",
      {
        method: "POST",
        body: JSON.stringify(user?.uid),
      }
    ).then((r) => r.json());
    if (isValid) {
      setIsSignedIn(true);
    } else {
      console.log("invalid user!");
    }
  };
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
      {isSignedIn ? (
        <button
          onClick={() => {
            setIsSignedIn(false);
            firebase.auth().signOut();
          }}
        >
          Sign-out
        </button>
      ) : (
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      )}
    </div>
  );
};

export default AdminView;
