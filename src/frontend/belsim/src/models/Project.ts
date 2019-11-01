import { types } from 'mobx-state-tree';

export enum ProjectType {
    RK = '1'
}

export const Project = types.model({
    ProjectId: types.identifier,
    ProjectName: types.string,
    CreatedAt: types.Date,
    ModifiedAt: types.Date,
    ProjectType: types.enumeration<ProjectType>('ProjectType', Object.values(ProjectType))
}).actions(self => ({

})).views(self => ({

}));