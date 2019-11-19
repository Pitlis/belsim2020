import * as React from 'react';
import { Router, Route, Switch } from 'react-router';
import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'App.scss';

import { StoresType, AuthStore } from 'stores';
import { routes } from 'routes';
import { ProjectDetails } from 'scenes/ProjectDetails';
import { Projects } from 'scenes/Projects';
import { Login } from 'scenes/Login';

@inject((stores: StoresType) => ({
  stores
}))
@observer
export class App extends Component<{ history: History, stores?: StoresType }>{
  private authStore: AuthStore;

  constructor(props) {
    super(props);
    this.authStore = this.props.stores!.AuthStore;
  }

  public render(): JSX.Element {
    console.log(this.authStore.IsSignInChecked);
    console.log(this.props.history);
    if (this.authStore.IsSignInChecked) {
      return (
        <Router history={this.props.history} >
          <Switch>
            <Route
              path={routes.main.path}
              exact={routes.main.exact}
              component={Login} />
            <Route
              path={routes.projects.path}
              exact={routes.projects.exact}
              component={Projects} />
            <Route
              path={routes.projectDetails.path}
              exact={routes.projectDetails.exact}
              component={ProjectDetails} />
          </Switch>
        </Router>
      );
    } else {
      return (<div></div>);
    }
  }
}