// import { http } from './http';

import { BelsimProjectType, Project } from 'models';

export const project = Object.freeze({
    async getAvailableProjects(): Promise<Project[]> {
        let tempResponse: Project[] = [
            {
                ProjectId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecd',
                ProjectName: 'Project 1',
                CreatedAt: new Date(),
                ModifiedAt: new Date(),
                ProjectType: BelsimProjectType.RK
            },
            {
                ProjectId: '0fb59f84-342b-41d9-b340-7f9dee5d819b',
                ProjectName: 'Project 2',
                CreatedAt: new Date(),
                ModifiedAt: new Date(),
                ProjectType: BelsimProjectType.RK
            }
        ];
        return tempResponse;
    }
});