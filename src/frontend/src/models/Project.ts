export enum BelsimProjectType {
    RK = '1'
}
export class Project {
    public projectId: string = '';
    public projectName: string = '';
    public createdAt: Date = new Date();
    public modifiedAt: Date = new Date();
    public projectType: BelsimProjectType = BelsimProjectType.RK;
    public organizationName: string = '';
    public comments: string = '';
}