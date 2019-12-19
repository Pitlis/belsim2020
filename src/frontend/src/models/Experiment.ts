import { UserName } from "models";

export enum ExperimentStatus {
    Created = 1,
    InProgress = 2,
    Completed = 3,
    Failed = 4
}
export class Experiment {
    public rkExperimentId: string = '';
    public createdBy: UserName;
    public name: string = '';

    public experimentTemplateId: string = '';
    public experimentTemplateName: string = '';

    public createdAt: Date = new Date();

    public experimentData: any;
    public resultData: any;

    public status: ExperimentStatus;
    public statusChangedAt: Date = new Date();
}