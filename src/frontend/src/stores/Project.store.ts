import { action, observable, runInAction } from 'mobx';

import { Project } from 'models';
import { api } from 'repositories';


export class ProjectStore {
    @observable public availableProjects: Project[];
    @observable public currenProject: Project;
    @observable public isLoading: boolean;

    public constructor() {
        this.init();
    }

    @action
    public init(): void {
        this.isLoading = true;
        this.availableProjects = new Array<Project>();
    }

    @action
    public async openProject(projectId: string): Promise<void> {
        this.isLoading = true;

        let project = this.availableProjects.find(p => p.projectId === projectId);
        if (project) {
            this.currenProject = project;
            this.isLoading = false;
        }
        else {
            await this.loadProject(projectId);
        }
    }

    @action
    private async loadProject(projectId: string) {
        this.currenProject = await api.project.getProject(projectId);
        runInAction(() => {
            this.isLoading = false;
        });
    }

    @action
    public async addProject(): Promise<void> {
        await Promise.resolve();

        // this.availableProjects.push({
        //     ProjectId: (this.availableProjects.length + 1).toString(),
        //     CreatedAt: new Date(),
        //     ModifiedAt: new Date(),
        //     ProjectName: 'Project ' + (this.availableProjects.length + 1).toString(),
        //     ProjectType: BelsimProjectType.RK,
        //     OrganizationName: 'БРУ',
        //     Comments: ''
        // });
    }

    @action
    public async loadAvailableProjects(): Promise<void> {
        this.isLoading = true;
        this.availableProjects = await api.project.getAvailableProjects();
        runInAction(() => {
            this.isLoading = false;
        });
    }
}