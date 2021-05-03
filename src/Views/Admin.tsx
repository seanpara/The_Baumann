import React, { useState, useEffect } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase, { User } from "firebase";

import { firebaseConfig } from "../firebaseConfig";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

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
  const { isSignedIn, isValid } = authData;

  const [artBoxText, setArtBoxText] = useState("");
  const [imageAsFile, setImageAsFile] = useState<File | null>(null);
  const [imageAsUrl, setImageAsUrl] = useState<{ imgUrl: string }>({
    imgUrl: "",
  });

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
  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user: User | null) => {
        validateUser(user);
      });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  useEffect(() => {
    console.log({ imageAsUrl });
  }, [imageAsUrl]);
  const handleSubmit = () => {
    fetch(
      "https://us-central1-baumann-firebase.cloudfunctions.net/setHomePageText",
      { method: "POST", body: JSON.stringify(artBoxText) }
    ).then((r) => {
      setArtBoxText(r.status === 200 ? "" : "Something Went Wrong, tell Sean!");
    });
  };
  const handleFireBaseUpload = (e: any) => {
    e.preventDefault();

    if (!imageAsFile) {
      throw new Error("No file to Submit!");
    }

    const storage = firebase.storage();
    const uploadTask = storage
      .ref(`/images/${imageAsFile.name}`)
      .put(imageAsFile);

    //initiates the firebase side uploading
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      (err) => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref("images")
          .child(imageAsFile.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            setImageAsUrl((prevObject: any) => ({
              ...prevObject,
              imgUrl: fireBaseUrl,
            }));
          });
      }
    );
  };
  const handleImageAsFile = (e: any) => {
    const image = e.target.files[0];
    setImageAsFile(() => image);
  };
  return (
    <div>
      {isSignedIn && isValid && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <h1>You Are Signed In!</h1>
            <button
              onClick={() => {
                setAuthData({ isSignedIn: false, isValid: false });
                firebase.auth().signOut();
              }}
            >
              Sign-out
            </button>
          </div>

          <TextField
            variant="filled"
            color="secondary"
            style={{ width: "50%" }}
            value={artBoxText}
            onChange={({ target: { value } }) => {
              setArtBoxText(value);
            }}
          />
          <Button
            variant="contained"
            disabled={!artBoxText}
            onClick={handleSubmit}
          >
            submit
          </Button>

          <Button variant="contained" component="label">
            Upload File
            <input type="file" hidden onChange={handleImageAsFile} />
          </Button>
          <Button onClick={handleFireBaseUpload} variant="contained">
            Submit Upload
          </Button>
          {imageAsUrl.imgUrl && <img src={imageAsUrl.imgUrl}></img>}
        </div>
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
          Admin Privileges
        </h1>
      )}
    </div>
  );
};

export default AdminView;
