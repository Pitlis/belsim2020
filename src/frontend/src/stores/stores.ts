import { History } from 'history';
import { ProjectStore } from './Project.store';
import { RouterStore } from './Router.store';

export function createStores(history: History) {
    return Object.freeze({
        routerStore: new RouterStore(history),
        projectStore: new ProjectStore()
    });
}
