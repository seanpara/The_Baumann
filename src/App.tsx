import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { RecoilRoot, useRecoilState } from "recoil";
import { ThemeProvider } from "@material-ui/core/styles";

import HomePage from "./Views/HomePage";
import AboutPage from "./Views/AboutPage";
import ContactPage from "./Views/ContactPage";
import Calendar from "./Views/Calendar";
import Header from "./Components/Header";
import { eventState } from "./atoms";
import { EventMap } from "./Views/Calendar";
import { theme } from "./styles";

const App = (): JSX.Element => {
  const [, setEvents] = useRecoilState(eventState);
  useEffect(() => {
    fetch(
      "https://us-central1-baumann-firebase.cloudfunctions.net/getCalendarEvents"
    )
      .then((r) => r.json())
      .then((eventMap: EventMap): void => {
        setEvents(eventMap);
      });
  }, []);
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Header />
        <Switch>
          <div style={{ height: "90%" }}>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route exact path="/about">
              <AboutPage />
            </Route>
            <Route exact path="/contact">
              <ContactPage />
            </Route>
            <Route exact path="/events">
              <Calendar />
            </Route>
            <Route exact path="/admin">
              <div>This will be a secret admin page</div>
            </Route>
          </div>
        </Switch>
      </ThemeProvider>
    </Router>
  );
};

export default App;
