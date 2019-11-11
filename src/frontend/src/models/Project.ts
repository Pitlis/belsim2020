export enum BelsimProjectType {
    RK = '1'
}
export class Project {
    public ProjectId: string = '';
    public ProjectName: string = '';
    public CreatedAt: Date = new Date();
    public ModifiedAt: Date = new Date();
    public ProjectType: BelsimProjectType = BelsimProjectType.RK;
    public OrganizationName: string = '';
    public Comments: string = '';
}