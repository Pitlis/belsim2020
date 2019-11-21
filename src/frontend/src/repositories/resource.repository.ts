// import { http } from './http';

import { Resource } from 'models';

export const resource = Object.freeze({
    async getProjectResources(projectId: string): Promise<Resource[]> {
        console.log(tempResponse);
        console.log(projectId);
        return tempResponse;
    },
    async createResource(name: string, projectId: string): Promise<void> {
        // return http.post('/account/login', authUser)
        //     .then(response => response.data);
        await Promise.resolve();
        tempResponse.push({ Name: name, RkResourceId: ('5e5dfadb-2ab1-466e-9dbc-351a1097fec' + (tempResponse.length + 1).toString()) })
    },
    async deleteResource(resourceId: string): Promise<void> {
        // return http.post('/account/login', authUser)
        //     .then(response => response.data);
        await Promise.resolve();
        tempResponse = tempResponse.filter(t => t.RkResourceId !== resourceId);
    },
});

let tempResponse: Resource[] = [
    {
        RkResourceId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecd',
        Name: 'Ресурс 1'
    },
    {
        RkResourceId: '5e5dfadb-2ab1-466e-9dbc-351a1097fec2',
        Name: 'Ресурс 2'
    },
    {
        RkResourceId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecb',
        Name: 'Ресурс 3'
    },
    {
        RkResourceId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecv',
        Name: 'Ресурс 4'
    },
    {
        RkResourceId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecc',
        Name: 'Ресурс 5'
    },
    {
        RkResourceId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecx',
        Name: 'Ресурс 6'
    },
    {
        RkResourceId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecz',
        Name: 'Ресурс 7'
    },
    {
        RkResourceId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecl',
        Name: 'Ресурс 8'
    },
    {
        RkResourceId: '5e5dfadb-2ab1-466e-9dbc-351a1097feck',
        Name: 'Ресурс 9'
    },
    {
        RkResourceId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecj',
        Name: 'Ресурс 10'
    },
    {
        RkResourceId: '5e5dfadb-2ab1-466e-9dbc-351a1097fech',
        Name: 'Ресурс 11'
    },
    {
        RkResourceId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecg',
        Name: 'Ресурс 12'
    },
    {
        RkResourceId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecf',
        Name: 'Ресурс 13'
    },
    {
        RkResourceId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecd',
        Name: 'Ресурс 14'
    },
    {
        RkResourceId: '5e5dfadb-2ab1-466e-9dbc-351a1097feca',
        Name: 'Ресурс 15'
    },
];