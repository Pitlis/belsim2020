import { http } from './http';

import { Experiment, ExperimentShortInfo } from 'models';

export const experiment = Object.freeze({
    async getExperimentsOfProject(projectId: string): Promise<ExperimentShortInfo[]> {
        return http.get('/experiment/get-experiments-of-project/' + projectId)
            .then(response => response.data);
    },
    async getExperiement(experimentId: string): Promise<Experiment> {
        return http.get('/experiment/get-experiment/' + experimentId)
            .then(response => response.data);
    }
});