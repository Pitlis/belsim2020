import * as React from 'react';
import { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { StoresType, ProductStore, ProjectStore, RouterStore } from 'stores';
import { getIdFromUrl } from 'routes/getIdFromUrl';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class ProjectDetailsContainer extends Component<{ stores?: StoresType }>{
    private productStore: ProductStore;
    private projectStore: ProjectStore;
    private routerStore: RouterStore;

    constructor(props) {
        super(props);
        this.productStore = this.props.stores!.ProductStore;
        this.projectStore = this.props.stores!.ProjectStore;
        this.routerStore = this.props.stores!.RouterStore;
        console.log(this.productStore);
        console.log(this.projectStore);
        console.log('project id: ' + getIdFromUrl(this.routerStore.location));
    }

    public render(): JSX.Element {
        return (
            <div>
                111
                {this.props.children}
            </div>
        );
    }
}