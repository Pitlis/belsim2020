import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { AuthStore, StoresType, RouterStore } from 'stores';
import { routes } from 'routes';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class Logout extends Component<{ stores: StoresType }> {
    public authStore: AuthStore;
    public routeStore: RouterStore;

    constructor(props) {
        super(props);
        this.authStore = this.props.stores!.AuthStore;
        this.routeStore = this.props.stores!.RouterStore;

        this.authStore.logout()
            .then(() => {
                this.routeStore.push(routes.login.path);
            });
    }


    public render(): JSX.Element {
        return (<></>);
    }
}