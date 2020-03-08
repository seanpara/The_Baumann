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
      main: "#757575",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: "#1976d2",
      main: "#8c9eff",
      // dark: will be calculated from palette.secondary.main,
      dark: "#0d47a1",
      contrastText: "#ffcc00",
    },
  },
  typography: {
    fontFamily:
      "-apple-system,system-ui,BlinkMacSystemFont," +
      '"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  },
});

const App = () => {
  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <Header />
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/about">
            <AboutPage />
          </Route>
        </Switch>
      </ThemeProvider>
    </Router>
  );
};

export default App;
