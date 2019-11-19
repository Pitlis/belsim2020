import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { RouterStore, ProductStore, StoresType } from 'stores';
import { routes, makeUrlWithParams } from 'routes';
import './ProjectProductsResourcesEditor.scss';
import { getIdFromUrl } from 'routes/getIdFromUrl';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class ProjectProductsResourcesEditor extends Component<{ stores?: StoresType }> {
    public productStore: ProductStore;
    public routerStore: RouterStore;

    constructor(props) {
        super(props);
        this.productStore = this.props.stores!.ProductStore;
        this.routerStore = this.props.stores!.RouterStore;
    }

    componentDidMount() {
        let projectId = getIdFromUrl(this.routerStore.location);
        this.productStore.loadProducts(projectId);
    }

    handleOpenProject = (projectId: string) => {
        this.routerStore.push(makeUrlWithParams(routes.projectDetails.path, { projectId }));
    }

    public render(): JSX.Element {
        return (
            <div className='projects'>
                project products and resources
            </div>
        );
    }
}