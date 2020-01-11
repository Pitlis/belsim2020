import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'react-bootstrap';

import './Projects.scss';

import { ProjectCard } from 'components/ProjectCard';
import { ProjectStore, RouterStore, StoresType, AuthStore } from 'stores';
import { routes, makeUrlWithParams } from 'routes';
import { BelsimLoader } from 'components/BelsimLoader';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class Projects extends Component<{ stores?: StoresType }> {
    public projectStore: ProjectStore;
    public routerStore: RouterStore;
    public authStore: AuthStore;

    constructor(props) {
        super(props);
        this.projectStore = this.props.stores!.ProjectStore;
        this.routerStore = this.props.stores!.RouterStore;
        this.authStore = this.props.stores!.AuthStore;
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
                {this.projectStore.isLoading
                    ? <BelsimLoader />
                    : this.renderContent()
                }
            </div>
        );
    }

    private renderContent(): JSX.Element {
        return (
            <>
                {this.authStore.isAdmin && this.renderAdminButton()}
                <div className='projects-list'>
                    {this.projectStore.availableProjects.map((p) =>
                        <ProjectCard key={p.projectId} project={p} onOpenProject={this.handleOpenProject} />
                    )}
                </div>
            </>
        );
    }

    handleOpenAdminPanel = () => {
        this.routerStore.push(routes.admin.path);
    }

    private renderAdminButton(): JSX.Element {
        return (
            <div className='admin-button'>
                <Button
                    onClick={this.handleOpenAdminPanel}
                    variant="info"
                >
                    Администрирование системы
                </Button>
            </div>
        );
    }
}