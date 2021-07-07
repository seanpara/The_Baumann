import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { RecoilRoot, useRecoilState } from "recoil";
import { ThemeProvider } from "@material-ui/core/styles";

import HomePage from "./Views/HomePage";
import AboutPage from "./Views/AboutPage";
import ContactPage from "./Views/ContactPage";
import AdminView from "./Views/Admin";

import Calendar from "./Views/Calendar";
import Header from "./Components/Header";
import { eventState } from "./atoms";
import { CalendarEvent } from "./Views/Calendar";
import { theme } from "./styles";

const App = (): JSX.Element => {
  const [, setEvents] = useRecoilState(eventState);
  useEffect(() => {
    fetch(
      // "https://us-central1-baumann-firebase.cloudfunctions.net/getCalendarEvents"
      "http://localhost:5001/baumann-firebase/us-central1/getCalendarEvents"
    )
      .then((r) => r.json())
      .then((eventList: CalendarEvent[]): void => {
        setEvents(
          eventList.reduce(
            (acc: { [id: string]: CalendarEvent }, cur: CalendarEvent) => {
              acc[cur.id] = cur;
              return acc;
            },
            {}
          )
        );
      });
  }, []);
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Header />
        <Switch>
          <div style={{ height: "90%", width: "100%" }}>
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
              <AdminView />
            </Route>
          </div>
        </Switch>
      </ThemeProvider>
    </Router>
  );
};

export default App;
