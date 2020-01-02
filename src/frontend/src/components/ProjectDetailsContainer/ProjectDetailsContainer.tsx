import * as React from 'react';
import { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { StoresType, ProjectStore, RouterStore } from 'stores';
import { getProjectIdFromUrl } from 'routes/getIdFromUrl';
import { BelsimLoader } from 'components/BelsimLoader';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class ProjectDetailsContainer extends Component<{ stores?: StoresType }>{
    private projectStore: ProjectStore;
    private routerStore: RouterStore;

    constructor(props) {
        super(props);
        this.projectStore = this.props.stores!.ProjectStore;
        this.routerStore = this.props.stores!.RouterStore;

        let projectId = getProjectIdFromUrl(this.routerStore.location);
        this.projectStore.openProject(projectId);
    }

    public render(): JSX.Element {
        return (
            <div>
                {this.projectStore.isLoading ? (<BelsimLoader />) : (this.props.children)}
            </div>
        );
    }
}