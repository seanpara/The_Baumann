import localConfig from "./localConfig";

const isProduction = process.env.NODE_ENV === "production";

export const firebaseConfig = {
  apiKey: isProduction ? process.env.REACT_APP_API_KEY : localConfig.apiKey,
  authDomain: isProduction
    ? process.env.REACT_APP_AUTH_DOMAIN
    : localConfig.authDomain,
  databaseURL: isProduction
    ? process.env.REACT_APP_DATABASE_URL
    : localConfig.databaseURL,
  projectId: isProduction
    ? process.env.REACT_APP_PROJECT_ID
    : localConfig.projectId,
  storageBucket: isProduction
    ? process.env.REACT_APP_STORAGE_BUCKET
    : localConfig.storageBucket,
  messagingSenderId: isProduction
    ? process.env.REACT_APP_MESSAGING_SENDER_ID
    : localConfig.messagingSenderId,
  appId: isProduction ? process.env.REACT_APP_APP_ID : localConfig.appId,
  measurementId: isProduction
    ? process.env.REACT_APP_MEASUREMENT_ID
    : localConfig.measurementId,
};
