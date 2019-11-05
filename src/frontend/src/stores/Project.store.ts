import { action, observable } from 'mobx';

import { Project } from 'models';

export class ProjectStore {
    @observable public AvailableProjects: Project[];

    public constructor() {
        this.init();
    }

    @action
    public init(): void {
        this.AvailableProjects = new Array<Project>();
    }
}