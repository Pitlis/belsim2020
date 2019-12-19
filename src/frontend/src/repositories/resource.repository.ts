import { http } from './http';

import { Resource } from 'models';

export const resource = Object.freeze({
    async getProjectResources(projectId: string): Promise<Resource[]> {
        return http.get('/resource/all/' + projectId)
            .then(response => response.data);
    },
    async createResource(name: string, projectId: string): Promise<void> {
        // return http.post('/account/login', authUser)
        //     .then(response => response.data);
        await Promise.resolve();
        //tempResponse.push({ Name: name, RkResourceId: ('5e5dfadb-2ab1-466e-9dbc-351a1097fec' + (tempResponse.length + 1).toString()) })
    },
    async deleteResource(resourceId: string): Promise<void> {
        // return http.post('/account/login', authUser)
        //     .then(response => response.data);
        await Promise.resolve();
        //tempResponse = tempResponse.filter(t => t.RkResourceId !== resourceId);
    },
});