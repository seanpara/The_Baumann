import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import HomePage from "./Views/HomePage";
import AboutPage from "./Views/AboutPage";
import Header from "./Components/Header";

const darkTheme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#525252",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: "#0066ff",
      main: "#0044ff",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#ffcc00",
    },
  },
});

const App = () => (
  <Router>
    <ThemeProvider theme={darkTheme}>
      <Header />
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact ath="/about">
          <AboutPage />
        </Route>
      </Switch>
    </ThemeProvider>
  </Router>
);

export default App;
