import firebase, { User } from "firebase";

import { firebaseConfig } from "./firebaseConfig";

firebase.initializeApp(firebaseConfig);

// Configure FirebaseUI.
export const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

export const storage = firebase.storage();
export const auth = firebase.auth();
export const database = firebase.database();
