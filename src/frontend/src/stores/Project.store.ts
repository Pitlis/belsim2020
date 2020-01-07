import { action, observable, runInAction } from 'mobx';

import { Project } from 'models';
import { api } from 'repositories';
import { stores } from 'stores';


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
        try {
            this.currenProject = await api.project.getProject(projectId);
            runInAction(() => {
                this.isLoading = false;
            });
        } catch (err) {
            console.log(err);
            stores.ErrorStore.addError('Ошибка открытия проекта. Попробуйте обновить страницу.');
        }
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
        try {
            this.availableProjects = new Array<Project>();
            this.availableProjects = await api.project.getAvailableProjects();
            runInAction(() => {
                this.isLoading = false;
            });
        } catch (err) {
            console.log(err);
            stores.ErrorStore.addError('Ошибка загрузки списка проектов. Попробуйте обновить страницу.');
        }
    }
}