import { action, observable, runInAction } from 'mobx';

import { Experiment, ExperimentShortInfo } from 'models';
import { api } from 'repositories';


export class ExperimentStore {
    @observable public projectExperimentsList: ExperimentShortInfo[];
    @observable public currenExperiment: Experiment | null;
    @observable public isLoading: boolean;

    public constructor() {
        this.init();
    }

    @action
    public init(): void {
        this.projectExperimentsList = new Array<ExperimentShortInfo>();
    }

    @action
    public async loadProjectExperimentsList(projectId: string): Promise<void> {
        this.isLoading = true;
        this.projectExperimentsList = await api.experiment.getExperimentsOfProject(projectId);
        runInAction(() => {
            this.isLoading = false;
        });
    }

    @action
    public async openExperiment(experimentId: string): Promise<void> {
        this.isLoading = true;
        this.currenExperiment = await api.experiment.getExperiement(experimentId);
        runInAction(() => {
            this.isLoading = false;
        });
    }
}