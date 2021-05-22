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
  const [imageAsFile, setImageAsFile] = useState<{
    file: File;
    name: string;
  } | null>(null);
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
    const unregisterAuthObserver = auth.onAuthStateChanged(
      (user: User | null) => {
        validateUser(user);
      }
    );
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  useEffect(() => {
    storage
      .ref("images")
      .child("testingtesting")
      .getDownloadURL()
      .then((fireBaseUrl) => {
        setImageAsUrl((prevObject: any) => ({
          ...prevObject,
          imgUrl: fireBaseUrl,
        }));
      });
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

    if (!imageAsFile) {
      throw new Error("No file to Submit!");
    }

    const uploadTask = storage
      .ref(`/images/${imageAsFile.name}`)
      .put(imageAsFile.file);

    // //initiates the firebase side uploading
    // uploadTask.on(
    //   "state_changed",
    //   (snapShot) => {
    //     //takes a snap shot of the process as it is happening
    //     console.log(snapShot);
    //   },
    //   (err) => {
    //     //catches the errors
    //     console.log(err);
    //   },
    //   () => {
    //     // gets the functions from storage refences the image storage in firebase by the children
    //     // gets the download url then sets the image from firebase as the value for the imgUrl key:
    //     storage
    //       .ref("images")
    //       .child(imageAsFile.name)
    //       .getDownloadURL()
    //       .then((fireBaseUrl) => {
    //         setImageAsUrl((prevObject: any) => ({
    //           ...prevObject,
    //           imgUrl: fireBaseUrl,
    //         }));
    //       });
    //   }
    // );
  };
  const handleImageAsFile = (
    e: ChangeEvent<HTMLInputElement>,
    imageName: string
  ) => {
    console.log(imageName);
    // @ts-ignore
    const image: File | null = e?.target?.files[0];

    if (image) {
      setImageAsFile(() => ({ file: image, name: imageName }));
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

          <div
            style={{
              borderColor: "black",
              borderWidth: "10px",
              borderStyle: "dotted",
              width: "60%",
              height: "50%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {imageNames.map((name) => (
              <Button variant="contained" component="label">
                Upload File {name}
                <input
                  type="file"
                  hidden
                  onChange={(event) => handleImageAsFile(event, name)}
                />
              </Button>
            ))}
          </div>

          <Button onClick={handleFireBaseUpload} variant="contained">
            Submit Upload
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
