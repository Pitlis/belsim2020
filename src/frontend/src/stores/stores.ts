import { History } from 'history';
import { ProjectStore } from './Project.store';
import { RouterStore } from './Router.store';

export function createStores(history: History) {
    console.log('!!!!');
    console.log(ProjectStore.name);
    return Object.freeze({
        RouterStore: new RouterStore(history),
        ProjectStore: new ProjectStore()
    });
}
