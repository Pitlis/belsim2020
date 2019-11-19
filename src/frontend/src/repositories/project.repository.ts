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
                ProjectType: BelsimProjectType.RK,
                OrganizationName: 'Белорусско-Российский университет',
                Comments: 'Non arcu risus quis varius quam quisque id diam. Lorem ipsum dolor sit amet consectetur adipiscing. Diam donec adipiscing tristique risus. Lacus luctus accumsan tortor posuere. Eu scelerisque felis imperdiet proin fermentum.'
            },
            {
                ProjectId: '0fb59f84-342b-41d9-b340-7f9dee5d819b',
                ProjectName: 'Project 2',
                CreatedAt: new Date(),
                ModifiedAt: new Date(),
                ProjectType: BelsimProjectType.RK,
                OrganizationName: 'Белорусско-Российский университет',
                Comments: ''
            }
        ];
        return tempResponse;
    },
    async getProject(projectId: string): Promise<Project> {
        return {
            ProjectId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecd',
            ProjectName: 'Project 1',
            CreatedAt: new Date(),
            ModifiedAt: new Date(),
            ProjectType: BelsimProjectType.RK,
            OrganizationName: 'Белорусско-Российский университет',
            Comments: 'Non arcu risus quis varius quam quisque id diam. Lorem ipsum dolor sit amet consectetur adipiscing. Diam donec adipiscing tristique risus. Lacus luctus accumsan tortor posuere. Eu scelerisque felis imperdiet proin fermentum.'
        };
    }
});