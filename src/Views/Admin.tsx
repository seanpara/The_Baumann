import React, { useState, useEffect, ChangeEvent } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { User } from "firebase";

import { storage, auth, uiConfig } from "../firebase";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// TO DO - clean the hell up

export const imageNames = ["image1", "image2", "image3"];
const initialImageState = imageNames.reduce(
  (acc, imageName) => ({ ...acc, [imageName]: { file: "", link: "" } }),
  {}
);
const AdminView = (): JSX.Element => {
  const [authData, setAuthData] = useState({
    isSignedIn: false,
    isValid: false,
  });
  // Local signed-in state.
  const { isSignedIn, isValid } = authData;

  const [artBoxText, setArtBoxText] = useState("");
  const [imageFiles, setImageFiles] =
    useState<{
      [imageName: string]: { file: File; link: string };
    }>(initialImageState);

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
    // Make sure we un-register Firebase observers when the component unmounts.
    return () => unregisterAuthObserver();
  }, []);

  const handleSubmit = () => {
    const {
      image1: { link: image1Link },
      image2: { link: image2Link },
      image3: { link: image3Link },
    } = imageFiles;
    // TODO fix later sry
    const slide2Text = artBoxText;
    fetch(
      "https://us-central1-baumann-firebase.cloudfunctions.net/setHomePageText",
      // "http://localhost:5001/baumann-firebase/us-central1/setHomePageText",
      {
        method: "POST",
        body: JSON.stringify({
          ...(slide2Text && { slide2Text }),
          ...(image1Link && { image1: image1Link }),
          ...(image2Link && { image2: image2Link }),
          ...(image3Link && { image3: image3Link }),
        }),
      }
    ).then((r) => {
      setArtBoxText(r.status === 200 ? "" : "Something Went Wrong, tell Sean!");
    });
  };

  const handleFireBaseUpload = (e: any) => {
    e.preventDefault();

    Object.entries(imageFiles)
      .filter(([_, { file }]) => file)
      .forEach(([imageName, { file }]) =>
        storage.ref(`/images/${imageName}`).put(file)
      );

    setImageFiles(initialImageState);
  };
  const handleImageAsFile = (
    e: ChangeEvent<HTMLInputElement>,
    imageName: string
  ) => {
    // @ts-ignore
    const image: File | null = e?.target?.files[0];

    if (image) {
      setImageFiles((prevImageFiles) => ({
        ...prevImageFiles,
        [imageName]: { ...prevImageFiles[imageName], file: image },
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
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
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

                  {imageFiles[name].file && (
                    <img
                      style={{ width: "40vw", height: "auto" }}
                      src={URL.createObjectURL(imageFiles[name].file)}
                    />
                  )}
                </div>
                <TextField
                  variant="filled"
                  color="secondary"
                  style={{ width: "50%" }}
                  label="Set Image Slide Link Here!"
                  onChange={({ target: { value } }) => {
                    setImageFiles((prevImageFiles) => ({
                      ...prevImageFiles,
                      [name]: { ...prevImageFiles[name], link: value },
                    }));
                  }}
                />
              </div>
            ))}
          </div>

          <Button
            onClick={handleFireBaseUpload}
            variant="contained"
            disabled={imageNames.filter((n) => imageFiles[n].file).length === 0}
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
