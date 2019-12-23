import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import './Projects.scss';

import { ProjectCard } from 'components/ProjectCard';
import { ProjectStore, RouterStore, StoresType } from 'stores';
import { routes, makeUrlWithParams } from 'routes';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class Projects extends Component<{ stores?: StoresType }> {
    public projectStore: ProjectStore;
    public routerStore: RouterStore;

    constructor(props) {
        super(props);
        this.projectStore = this.props.stores!.ProjectStore;
        this.routerStore = this.props.stores!.RouterStore;
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