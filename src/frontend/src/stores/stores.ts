import { ProjectStore } from './Project.store';
import { RouterStore } from './Router.store';
import { AuthStore } from './Auth.store';

import { createBrowserHistory } from 'history';
import { ProductStore } from './Product.store';
import { ResourceStore } from './Resource.store';
import { ExperimentStore } from './Experiment.store';

export const history = createBrowserHistory();

export const stores = Object.freeze({
    RouterStore: new RouterStore(history),
    ProjectStore: new ProjectStore(),
    AuthStore: new AuthStore(),
    ProductStore: new ProductStore(),
    ResourceStore: new ResourceStore(),
    ExperimentStore: new ExperimentStore()
});

export type StoresType = typeof stores;