import { ExperimentStatus } from "models";

export class ExperimentShortInfo {
    public experimentId: string = '';
    public name: string = '';

    public ownerName: string = '';

    public experimentTemplateName: string = '';
    public experimentTemplateId: string = '';

    public createdAt: Date = new Date();
    public status: ExperimentStatus;
    public statusChangedAt: Date = new Date();
}