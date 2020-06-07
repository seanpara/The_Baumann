import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';

import HomePage from './Views/HomePage';
import AboutPage from './Views/AboutPage';
import ContactPage from './Views/ContactPage';
import Header from './Components/Header';
import { theme } from './styles';

const App = () => (
  <Router>
    <ThemeProvider theme={theme}>
      <Header />
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/about">
          <AboutPage />
        </Route>
        <Route exact path="/contact">
          <ContactPage />
        </Route>
      </Switch>
    </ThemeProvider>
  </Router>
);

export default App;