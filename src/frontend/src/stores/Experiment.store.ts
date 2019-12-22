import { action, observable, runInAction } from 'mobx';

import { Experiment, ExperimentShortInfo, ResponseName } from 'models';
import { api } from 'repositories';


export class ExperimentStore {
    @observable public projectExperimentsList: ExperimentShortInfo[];
    @observable public currenExperiment: Experiment | null;
    @observable public isLoading: boolean;
    @observable public responseNamesList: ResponseName[];

    public constructor() {
        this.init();
    }

    @action
    public init(): void {
        this.isLoading = true;
        this.projectExperimentsList = new Array<ExperimentShortInfo>();
        this.responseNamesList = new Array<ResponseName>();
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
            this.responseNamesList = this.createResponseNamesList(this.currenExperiment as Experiment);
            this.isLoading = false;
        });
    }

    private createResponseNamesList(experiment: Experiment) {
        let originalNames = experiment.resultData[0].variables.map(v => v.name);
        return originalNames.map(originalName => new ResponseName(originalName));
    }
}