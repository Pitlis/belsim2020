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
import { ProjectDetailsContainer } from 'components/ProjectDetailsContainer';
import { ProjectProductsResourcesEditor } from 'scenes/ProjectProductsResourcesEditor';
import { ExperimentResults } from 'scenes/ExperimentResults';
import { BelsimHeader } from 'components/BelsimHeader';
import { TemplateEditor } from 'scenes/TemplateEditor';
import { ProjectExperiments } from 'scenes/ProjectExperiments';
import { Logout } from 'scenes/Logout';
import { AdminPanel } from 'scenes/AdminPanel';

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
    if (this.authStore.IsSignInChecked) {
      return (
        <Router history={this.props.history} >
          <Switch>
            <Route
              path={routes.login.path}
              exact={routes.login.exact}
              component={Login} />
            <Route
              path={routes.logout.path}
              exact={routes.logout.exact}
              component={Logout} />
            <BelsimHeader>
              <Route
                path={routes.projects.path}
                exact={routes.projects.exact}
                component={Projects} />
              <Route
                path={routes.admin.path}
                exact={routes.admin.exact}
                component={AdminPanel} />
              <Route
                path={routes.baseProjectUrl.path}
              >
                <ProjectDetailsContainer>
                  <Route
                    path={routes.projectProductsAndResources.path}
                    exact={routes.projectProductsAndResources.exact}
                    component={ProjectProductsResourcesEditor} />
                  <Route
                    path={routes.projectDetails.path}
                    exact={routes.projectDetails.exact}
                    component={ProjectDetails} />
                  <Route
                    path={routes.experimentResults.path}
                    exact={routes.experimentResults.exact}
                    component={ExperimentResults} />
                  <Route
                    path={routes.template.path}
                    exact={routes.template.exact}
                    component={TemplateEditor} />
                  <Route
                    path={routes.experimentsList.path}
                    exact={routes.experimentsList.exact}
                    component={ProjectExperiments} />
                </ProjectDetailsContainer>
              </Route>
            </BelsimHeader>
          </Switch>
        </Router>
      );
    } else {
      return (<div></div>);
    }
  }
}