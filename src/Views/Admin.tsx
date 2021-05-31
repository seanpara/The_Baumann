import React, { useState, useEffect, ChangeEvent } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { User } from "firebase";

import { storage, auth, uiConfig } from "../firebase";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// TO DO - clean the hell up

export const imageNames = ["image1", "image2", "image3"];

const AdminView = (): JSX.Element => {
  const [authData, setAuthData] = useState({
    isSignedIn: false,
    isValid: false,
  }); // Local signed-in state.
  const { isSignedIn, isValid } = authData;

  const [artBoxText, setArtBoxText] = useState("");
  const [imageFiles, setImageFiles] = useState<{
    [imageName: string]: File;
  }>(imageNames.reduce((acc, imageName) => ({ ...acc, [imageName]: "" }), {}));

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
    const unregisterAuthObserver = auth.onAuthStateChanged(
      (user: User | null) => {
        validateUser(user);
      }
    );
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

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
    Object.entries(imageFiles)
      .filter(([_, file]) => file)
      .map(([imageName, imageFile]) =>
        storage.ref(`/images/${imageName}`).put(imageFile)
      );
  };
  const handleImageAsFile = (
    e: ChangeEvent<HTMLInputElement>,
    imageName: string
  ) => {
    console.log(imageName);
    // @ts-ignore
    const image: File | null = e?.target?.files[0];

    if (image) {
      setImageFiles((prevImageFiles) => ({
        ...prevImageFiles,
        [imageName]: image,
      }));
    }
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
                auth.signOut();
              }}
            >
              Sign-out
            </button>
          </div>
          <div
            style={{ display: "flex", width: "100%", justifyContent: "center" }}
          >
            <TextField
              variant="filled"
              color="secondary"
              style={{ width: "50%" }}
              value={artBoxText}
              label="Set Slide 2 Text Here!"
              onChange={({ target: { value } }) => {
                setArtBoxText(value);
              }}
            />
            {artBoxText && (
              <Button
                variant="contained"
                disabled={!artBoxText}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            )}
          </div>

          <div
            style={{
              width: "60%",
              height: "50%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {imageNames.map((name) => (
              <div
                style={{
                  borderColor: "black",
                  borderWidth: "10px",
                  borderStyle: "dotted",
                  display: "flex",
                }}
              >
                <Button variant="contained" component="label">
                  Upload File {name}
                  <input
                    type="file"
                    hidden
                    onChange={(event) => handleImageAsFile(event, name)}
                  />
                </Button>
                {imageFiles[name] && (
                  <img
                    style={{ width: "40vw", height: "auto" }}
                    src={URL.createObjectURL(imageFiles[name])}
                  />
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={handleFireBaseUpload}
            variant="contained"
            disabled={imageNames.filter((n) => imageFiles[n]).length === 0}
          >
            Upload Images
          </Button>
        </div>
      )}
      {!isSignedIn && !isValid && (
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
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
