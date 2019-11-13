import { ProjectStore } from './Project.store';
import { RouterStore } from './Router.store';
import { AuthStore } from './Auth.store';

import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const stores = Object.freeze({
    RouterStore: new RouterStore(history),
    ProjectStore: new ProjectStore(),
    AuthStore: new AuthStore()
});

export type StoresType = typeof stores;