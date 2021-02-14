import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from '@material-ui/core/styles';

import HomePage from './Views/HomePage';
import AboutPage from './Views/AboutPage';
import ContactPage from './Views/ContactPage';
import Calendar from './Views/Calendar';
import Header from './Components/Header';
import { theme } from './styles';

const App = (): JSX.Element => (
  <Router>
    <RecoilRoot>
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
          <Route exact path="/events">
            <Calendar />
          </Route>
          <Route exact path="/admin">
            <div>This will be a secret admin page</div>
          </Route>
        </Switch>
      </ThemeProvider>
    </RecoilRoot>
  </Router>
);

export default App;
