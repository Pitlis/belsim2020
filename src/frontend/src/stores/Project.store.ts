import { action, observable } from 'mobx';

import { Project, BelsimProjectType } from 'models';
import { api } from 'repositories';


export class ProjectStore {
    @observable public availableProjects: Project[];

    public constructor() {
        this.init();
    }

    @action
    public init(): void {
        this.availableProjects = new Array<Project>();
    }

    @action
    public async addProject(): Promise<void> {
        await Promise.resolve();
        
        this.availableProjects.push({
            ProjectId: (this.availableProjects.length + 1).toString(),
            CreatedAt: new Date(),
            ModifiedAt: new Date(),
            ProjectName: 'Project ' + (this.availableProjects.length + 1).toString(),
            ProjectType: BelsimProjectType.RK,
            OrganizationName: 'БРУ',
            Comments: ''
        });
    }

    @action
    public async loadAvailableProjects(): Promise<void> {
        this.availableProjects = await api.project.getAvailableProjects();
    }
}