import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';

import HomePage from './Views/HomePage';
import AboutPage from './Views/AboutPage';
import Header from './Components/Header';
import { theme } from './styles';

const App = () => {
  return (
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
        </Switch>
      </ThemeProvider>
    </Router>
  );
};

export default App;
