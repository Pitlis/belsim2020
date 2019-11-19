import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { RouterStore } from 'mobx-react-router';
import { getIdFromUrl } from 'routes/getIdFromUrl';
import { StoresType } from 'stores';
import { routes, makeUrlWithParams } from 'routes';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class ProjectDetails extends Component<{ stores: StoresType }> {
    public routerStore: RouterStore;

    constructor(props) {
        super(props);
        this.routerStore = this.props.stores!.RouterStore;
    }

    componentDidMount() {
        console.log(getIdFromUrl(this.routerStore.location));
    }

    handleOpenProjectProductsResources = () => {
        console.log(makeUrlWithParams(routes.projectProductsAndResources.path, { projectId: getIdFromUrl(this.routerStore.location) }));
        this.routerStore.push(makeUrlWithParams(routes.projectProductsAndResources.path, { projectId: getIdFromUrl(this.routerStore.location) }));
    }

    public render(): JSX.Element {
        return (
            <div>Some project details
                <button onClick={this.handleOpenProjectProductsResources}>go to resources and products</button>
            </div>
        );
    }
}