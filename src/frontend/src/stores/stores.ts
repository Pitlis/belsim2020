import { History } from 'history';
import { ProjectStore } from './Project.store';
import { RouterStore } from './Router.store';

export function createStores(history: History) {
    return Object.freeze({
        RouterStore: new RouterStore(history),
        ProjectStore: new ProjectStore()
    });
}
