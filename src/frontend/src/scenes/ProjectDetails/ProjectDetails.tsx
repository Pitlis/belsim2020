import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { RouterStore } from 'mobx-react-router';
import { getIdFromUrl } from 'routes/getIdFromUrl';

@inject(RouterStore.name)
@observer
export class ProjectDetails extends Component<{ routerStore: RouterStore }> {
    public routerStore: RouterStore;

    constructor(props) {
        super(props);
        this.routerStore = props[RouterStore.name];
    }

    componentDidMount() {
        console.log(getIdFromUrl(this.routerStore.location));
    }

    public render(): JSX.Element {
        return (
            <div>Some project details</div>
        );
    }
}