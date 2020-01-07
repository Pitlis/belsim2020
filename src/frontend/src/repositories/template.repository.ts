import { http } from './http';

import { RkExperimentTemplate, RkExperimentTemplateInfo } from 'models';

export const template = Object.freeze({
    async getProjectTemplates(projectId: string): Promise<RkExperimentTemplateInfo[]> {
        return http.get('/experiment-template/templates-in-project/' + projectId)
            .then(response => response.data);
    },
    async getEmptyTemplate(): Promise<RkExperimentTemplate> {
        return http.get('/experiment-template/get-empty')
            .then(response => response.data);
    },
    async getTemplate(templateId: string): Promise<RkExperimentTemplate> {
        return http.get('/experiment-template/get-info/' + templateId)
            .then(response => response.data);
    },
    async createTemplate(name: string, description: string, projectId: string): Promise<string> {
        return http.post('/experiment-template/create', { name, description, projectId })
            .then(response => response.data);
    },
    async updateTemplate(template: RkExperimentTemplate): Promise<void> {
        return http.put('/experiment-template/update', template)
            .then(response => response.data);
    },
    async updateProductsList(templateId: string, productIds: string[]): Promise<void> {
        return http.put('/experiment-template/update-products-list', { experimentTemplateId: templateId, productIds })
            .then(response => response.data);
    },
    async updateResourcesList(templateId: string, resourceIds: string[]): Promise<void> {
        return http.put('/experiment-template/update-resources-list', { experimentTemplateId: templateId, resourceIds })
            .then(response => response.data);
    },
    async createExperimentFromTemplate(templateId: string, name: string): Promise<void> {
        return http.post('/experiment-template/create-experiment-from-template',
            {
                ExperimentTemplateId: templateId,
                ExperimentName: name
            }
        ).then(response => response.data);
    },
});