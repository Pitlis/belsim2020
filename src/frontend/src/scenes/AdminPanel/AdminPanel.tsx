import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import './AdminPanel.scss';

import { StoresType, RouterStore, AdminStore } from 'stores';
import { Card, Button } from 'react-bootstrap';
import { UsersEditor } from './UsersEditor/UsersEditor';
import { ProjectsEditor } from './ProjectsEditor/ProjectsEditor';

enum AdminPanelFormName {
    USERS = 'Пользователи',
    PROJECTS = 'Проекты'
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
                {this.renderEditorsList()}
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
            case AdminPanelFormName.PROJECTS:
                return <ProjectsEditor />
            default:
                return null;
        }
    }
    handleOpenEditor = (editFormName: AdminPanelFormName) => {
        this.setState({ activeFormName: editFormName });
    }

    private renderEditorsList(): JSX.Element {
        return (
            <div className='admin-panels-list'>
                <Button
                    onClick={() => this.handleOpenEditor(AdminPanelFormName.USERS)}
                    variant="success"
                    className={`belsim-action-button ${this.state.activeFormName === AdminPanelFormName.USERS ? 'belsim-active-menu' : ''}`}
                >
                    {AdminPanelFormName.USERS}
                </Button>
                <Button
                    onClick={() => this.handleOpenEditor(AdminPanelFormName.PROJECTS)}
                    variant="success"
                    className={`belsim-action-button ${this.state.activeFormName === AdminPanelFormName.PROJECTS ? 'belsim-active-menu' : ''}`}
                >
                    {AdminPanelFormName.PROJECTS}
                </Button>
            </div>
        );
    }
}