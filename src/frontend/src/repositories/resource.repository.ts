import { http } from './http';

import { Resource } from 'models';

export const resource = Object.freeze({
    async getProjectResources(projectId: string): Promise<Resource[]> {
        return http.get('/resource/all/' + projectId)
            .then(response => response.data);
    },
    async createResource(name: string, projectId: string): Promise<void> {
        return http.post('/resource/create', {
            name: name,
            projectId: projectId
        }).then(response => response.data);
    },
    async deleteResource(resourceId: string): Promise<void> {
        return http.delete('/resource/delete/' + resourceId)
        .then(response => response.data);
    },
});