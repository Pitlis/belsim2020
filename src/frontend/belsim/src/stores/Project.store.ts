import { types, Instance } from 'mobx-state-tree';
import { Project, ProjectType } from 'models';



const ProjectStore = types.model({
    projects: types.array(Project)
}).actions(self => ({
    doSomenting(){
        self.projects[0].ProjectName = ProjectType.RK
    }
})).views(self => ({

}));

