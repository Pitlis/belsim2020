import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { ProjectCard } from 'components/ProjectCard';
import { ProjectStore, RouterStore } from 'stores';
import { routes, makeUrlWithParams } from 'routes';
import './Projects.scss';

@inject(ProjectStore.name, RouterStore.name)
@observer
export class Projects extends Component<{ projectStore: ProjectStore, routerStore: RouterStore }> {
    public projectStore: ProjectStore;
    public routerStore: RouterStore;

    constructor(props) {
        super(props);
        this.projectStore = props[ProjectStore.name];
        this.routerStore = props[RouterStore.name];
    }

    componentDidMount() {
        this.projectStore.loadAvailableProjects();
    }

    handleOpenProject = (projectId: string) => {
        this.routerStore.push(makeUrlWithParams(routes.projectDetails.path, { projectId }));
    }

    public render(): JSX.Element {
        return (
            <div className='projects'>
                {this.projectStore.availableProjects.map((p, i) => <ProjectCard key={i} project={p} onOpenProject={this.handleOpenProject} />)}
            </div>
        );
    }
}