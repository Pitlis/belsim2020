import { http } from './http';

import { Project } from 'models';

export const project = Object.freeze({
    async getAvailableProjects(): Promise<Project[]> {
        return http.get('/project/get-available-projects')
            .then(response => response.data);
    },
    async getProject(projectId: string): Promise<Project> {
        return http.get('/project/get-info/' + projectId)
            .then(response => response.data);
    }
});