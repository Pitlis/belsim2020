import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { StoresType, RouterStore, AdminStore } from 'stores';
import { Card } from 'react-bootstrap';
import { UsersEditor } from './UsersEditor/UsersEditor';

enum AdminPanelFormName {
    USERS = 'Пользователи'
}
interface IState {
    activeFormName: AdminPanelFormName;
    isLoading: boolean;
}

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class AdminPanel extends Component<{ stores: StoresType }, IState> {
    public routeStore: RouterStore;
    public adminStore: AdminStore;

    constructor(props) {
        super(props);
        this.adminStore = this.props.stores!.AdminStore;
        this.routeStore = this.props.stores!.RouterStore;

        this.state = {
            activeFormName: AdminPanelFormName.USERS,
            isLoading: true
        };
    }


    public render(): JSX.Element {
        return (
            <div className='admin-panel'>
                {this.renderPanel()}
            </div>
        );
    }

    private renderPanel(): JSX.Element {
        return (
            <>
                <div className='panel'>
                    <Card border='info' className='editor'>
                        <Card.Body>
                            <Card.Title>{this.state.activeFormName}</Card.Title>
                            {this.renderPanelComponent()}
                        </Card.Body>
                    </Card>
                </div>
            </>
        );
    }

    private renderPanelComponent(): JSX.Element | null {
        switch (this.state.activeFormName) {
            case AdminPanelFormName.USERS:
                return <UsersEditor />
            default:
                return null;
        }
    }
}