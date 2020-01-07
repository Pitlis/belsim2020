import { History } from 'history';
import {
    RouterStore as BaseRouterStore,
    syncHistoryWithStore
} from 'mobx-react-router';
import { reaction, observable, action } from 'mobx';
import { HeaderMenuItem, HeaderMenuItemPosition } from 'models';
import { routes, isUrlRelatedToRoute, makeUrlWithParams } from 'routes';
import { getProjectIdFromUrl } from 'routes/getIdFromUrl';

export class RouterStore extends BaseRouterStore {
    @observable public HeaderMenuItems: HeaderMenuItem[];

    constructor(history?: History) {
        super();
        if (history) {
            this.history = syncHistoryWithStore(history, this);
        }

        this.HeaderMenuItems = new Array<HeaderMenuItem>();

        reaction(
            () => this.location.pathname,
            (path: string) => this.configureHeaderMenu(path),
            { fireImmediately: true }
        );
    }

    @action
    private configureHeaderMenu(currentPath: string): void {
        if (isUrlRelatedToRoute(currentPath, routes.projects)) {
            this.HeaderMenuItems = this.attachAdditionalMenuItems(this.getMenuForProjectsPage());
            return;
        }
        if (isUrlRelatedToRoute(currentPath, routes.projectDetails)) {
            this.HeaderMenuItems = this.attachAdditionalMenuItems(this.getMenuForProjectDetailsPage());
            return;
        }
        if (isUrlRelatedToRoute(currentPath, routes.projectProductsAndResources)) {
            this.HeaderMenuItems = this.attachAdditionalMenuItems(this.getMenuForProjectProductsResourcesEditor());
            return;
        }
        if (isUrlRelatedToRoute(currentPath, routes.experimentResults)) {
            this.HeaderMenuItems = this.attachAdditionalMenuItems(this.getMenuForExperimentResults());
            return;
        }
        if (isUrlRelatedToRoute(currentPath, routes.template)) {
            this.HeaderMenuItems = this.attachAdditionalMenuItems(this.getMenuForTemplateEditor());
            return;
        }
        if (isUrlRelatedToRoute(currentPath, routes.experimentsList)) {
            this.HeaderMenuItems = this.attachAdditionalMenuItems(this.getMenuForProjectExperimentsList());
            return;
        }

        this.HeaderMenuItems = new Array<HeaderMenuItem>();
    }

    private getMenuForProjectsPage(): HeaderMenuItem[] {
        return [
            { title: 'FiGrid', position: HeaderMenuItemPosition.RIGHT, link: routes.projects.path, isIcon: true, isActive: true }
        ];
    }

    private getMenuForProjectDetailsPage(): HeaderMenuItem[] {
        return [
            { title: 'FiGrid', position: HeaderMenuItemPosition.RIGHT, link: routes.projects.path, isIcon: true },
            {
                title: 'Модели данных',
                position: HeaderMenuItemPosition.LEFT,
                link: makeUrlWithParams(routes.projectDetails.path, { projectId: getProjectIdFromUrl(this.location) }),
                isActive: true
            },
            {
                title: 'Продукты и ресурсы',
                position: HeaderMenuItemPosition.LEFT,
                link: makeUrlWithParams(routes.projectProductsAndResources.path, { projectId: getProjectIdFromUrl(this.location) })
            },
            {
                title: 'Эксперименты',
                position: HeaderMenuItemPosition.LEFT,
                link: makeUrlWithParams(routes.experimentsList.path, { projectId: getProjectIdFromUrl(this.location) })
            }
        ]
    }

    private getMenuForProjectProductsResourcesEditor(): HeaderMenuItem[] {
        return [
            { title: 'FiGrid', position: HeaderMenuItemPosition.RIGHT, link: routes.projects.path, isIcon: true },
            {
                title: 'Модели данных',
                position: HeaderMenuItemPosition.LEFT,
                link: makeUrlWithParams(routes.projectDetails.path, { projectId: getProjectIdFromUrl(this.location) })
            },
            {
                title: 'Продукты и ресурсы',
                position: HeaderMenuItemPosition.LEFT,
                link: makeUrlWithParams(routes.projectProductsAndResources.path, { projectId: getProjectIdFromUrl(this.location) }),
                isActive: true
            },
            {
                title: 'Эксперименты',
                position: HeaderMenuItemPosition.LEFT,
                link: makeUrlWithParams(routes.experimentsList.path, { projectId: getProjectIdFromUrl(this.location) })
            }
        ]
    }

    private getMenuForExperimentResults(): HeaderMenuItem[] {
        return [
            { title: 'FiGrid', position: HeaderMenuItemPosition.RIGHT, link: routes.projects.path, isIcon: true },
            {
                title: 'Модели данных',
                position: HeaderMenuItemPosition.LEFT,
                link: makeUrlWithParams(routes.projectDetails.path, { projectId: getProjectIdFromUrl(this.location) })
            },
            {
                title: 'Продукты и ресурсы',
                position: HeaderMenuItemPosition.LEFT,
                link: makeUrlWithParams(routes.projectProductsAndResources.path, { projectId: getProjectIdFromUrl(this.location) })
            },
            {
                title: 'Эксперименты',
                position: HeaderMenuItemPosition.LEFT,
                link: makeUrlWithParams(routes.experimentsList.path, { projectId: getProjectIdFromUrl(this.location) })
            }
        ]
    }

    private getMenuForTemplateEditor(): HeaderMenuItem[] {
        return [
            { title: 'FiGrid', position: HeaderMenuItemPosition.RIGHT, link: routes.projects.path, isIcon: true },
            {
                title: 'Модели данных',
                position: HeaderMenuItemPosition.LEFT,
                link: makeUrlWithParams(routes.projectDetails.path, { projectId: getProjectIdFromUrl(this.location) })
            },
            {
                title: 'Продукты и ресурсы',
                position: HeaderMenuItemPosition.LEFT,
                link: makeUrlWithParams(routes.projectProductsAndResources.path, { projectId: getProjectIdFromUrl(this.location) })
            },
            {
                title: 'Эксперименты',
                position: HeaderMenuItemPosition.LEFT,
                link: makeUrlWithParams(routes.experimentsList.path, { projectId: getProjectIdFromUrl(this.location) })
            }
        ]
    }

    private getMenuForProjectExperimentsList(): HeaderMenuItem[] {
        return [
            { title: 'FiGrid', position: HeaderMenuItemPosition.RIGHT, link: routes.projects.path, isIcon: true },
            {
                title: 'Модели данных',
                position: HeaderMenuItemPosition.LEFT,
                link: makeUrlWithParams(routes.projectDetails.path, { projectId: getProjectIdFromUrl(this.location) })
            },
            {
                title: 'Продукты и ресурсы',
                position: HeaderMenuItemPosition.LEFT,
                link: makeUrlWithParams(routes.projectProductsAndResources.path, { projectId: getProjectIdFromUrl(this.location) })
            },
            {
                title: 'Эксперименты',
                position: HeaderMenuItemPosition.LEFT,
                link: makeUrlWithParams(routes.experimentsList.path, { projectId: getProjectIdFromUrl(this.location) }),
                isActive: true
            }
        ]
    }

    private attachAdditionalMenuItems(menuItems: HeaderMenuItem[]) {
        return [
            ...menuItems,
            { title: 'FiLogOut', position: HeaderMenuItemPosition.RIGHT, link: routes.logout.path, isIcon: true },
        ]
    }
}

export default RouterStore;
