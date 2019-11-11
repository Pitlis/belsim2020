import * as React from 'react';
import { Router, Route, Switch } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';

import { routes } from 'routes';
import { ProjectDetails } from 'scenes/ProjectDetails';
import { Projects } from 'scenes/Projects';

// render react DOM
export const App = ({ history }) => (
  <Router history={history}>
    <Switch>
      <Route
        path={routes.main.path}
        exact={routes.main.exact}
        component={Projects} />
      <Route
        path={routes.projectDetails.path}
        exact={routes.projectDetails.exact}
        component={ProjectDetails} />
    </Switch>
  </Router>
);