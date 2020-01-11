import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules, SelectionChangedEvent } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import { Form, Button } from 'react-bootstrap';
import Select from 'react-select'

import './ProjectsEditor.scss';

import { AdminStore, StoresType } from 'stores';
import { BelsimInput } from 'components/BelsimInput';
import { BelsimLoader } from 'components/BelsimLoader';
import { Project, UserName, UserProfile } from 'models';
import { formatDate } from 'helpers/dateFormatter';


interface IState {
    selectedUser: UserName | null;
    selectedUserInDropdown: UserProfile | null;
    selectedProject: Project | null;
}

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class ProjectsEditor extends Component<{ stores?: StoresType }, IState> {
    public adminStore: AdminStore;

    constructor(props) {
        super(props);
        this.adminStore = this.props.stores!.AdminStore;

        this.state = {
            selectedUser: null,
            selectedProject: null,
            selectedUserInDropdown: null
        }

        this.adminStore.initCreateProjectControlForm();
    }

    componentDidMount() {
        this.adminStore.loadUsers();
        this.adminStore.loadProjects();
    }

    componentWillUnmount() {
        this.adminStore.createProjectControlForm.dispose();
    }

    public render(): JSX.Element {
        return (
            <div className='projects-editor'>
                {this.renderCreateProjectForm()}
                <hr />
                {
                    (this.adminStore.isLoading || this.adminStore.projectsList === undefined)
                        ? <BelsimLoader />
                        : this.renderProjectsList()
                }
                <hr />
                {
                    (this.adminStore.isLoading || this.adminStore.projectsList === undefined)
                        ? <BelsimLoader />
                        : this.renderUsersList()
                }
                <hr />
            </div>
        );
    }
    re

    handleCreateProject = async () => {
        await this.adminStore.createProject();
        this.setState({ selectedProject: null, selectedUser: null, selectedUserInDropdown: null });
    }

    private renderCreateProjectForm(): JSX.Element {
        return (
            <div className='block-editor create-project'>
                <div className='title'>Создание проектов</div>
                <div className='content'>
                    <Form noValidate>
                        <BelsimInput
                            inputType='text'
                            formControl={this.adminStore.createProjectControlForm.controls.name}
                            showErrors={this.adminStore.createProjectControlForm.controls.name.touched}
                            fieldName='Название проекта:'
                            className='name'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='text'
                            formControl={this.adminStore.createProjectControlForm.controls.organizationName}
                            showErrors={this.adminStore.createProjectControlForm.controls.organizationName.touched}
                            fieldName='Организация:'
                            className='name'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='text'
                            formControl={this.adminStore.createProjectControlForm.controls.comments}
                            showErrors={this.adminStore.createProjectControlForm.controls.comments.touched}
                            fieldName='Комментарии:'
                            className='name'
                        ></BelsimInput>
                    </Form>

                    <div className='create-user-button'>
                        <Button
                            disabled={this.adminStore.createProjectControlForm.invalid}
                            onClick={this.handleCreateProject}
                            variant="success"
                        >
                            Создать проект
                         </Button>
                    </div>
                </div>
            </div>
        );
    }

    handleProjectSelected = (event: SelectionChangedEvent) => {
        let selectedProject = event.api.getSelectedRows()[0] as Project;
        if (selectedProject) {
            this.setState({ selectedProject: selectedProject })
        } else {
            this.setState({ selectedProject: null });
        }
    }

    handleDeleteProject = () => {
        this.adminStore.deleteProject(this.state.selectedProject!.projectId!);
        this.setState({ selectedProject: null, selectedUser: null, selectedUserInDropdown: null });
    }

    handleUserInDropdownSelected = (selectedUser: any) => {
        this.setState({ selectedUserInDropdown: this.adminStore.usersList.find(p => p.id === selectedUser.value)! });
    }

    private renderUnsuedUsersList(): JSX.Element {
        let options: { value: string, label: string }[] = new Array<{ value: string, label: string }>();

        if (this.state.selectedProject) {
            options = this.adminStore.usersList
                .filter(u => !this.state.selectedProject!.assignedUsers.find(un => un.userId === u.id))
                .map(n => { return { value: n.id!, label: n.email }; })
        }


        return (
            <Select
                options={options}
                onChange={this.handleUserInDropdownSelected}
                isDisabled={this.state.selectedProject === null}
                value={this.state.selectedUserInDropdown ? {
                    value: this.state.selectedUserInDropdown!.id!,
                    label: this.state.selectedUserInDropdown!.email
                } : null}
            />
        );
    }

    private renderProjectsList(): JSX.Element {
        return (
            <div className='users-list'>
                <div className='title'>Список проектов</div>
                <div className='delete-project'>
                    <Button
                        disabled={this.state.selectedProject === null}
                        onClick={this.handleDeleteProject}
                        variant="danger"
                    >
                        Удалить проект
                    </Button>
                </div>
                <div className='ag-theme-balham'>
                    <AgGridReact
                        columnDefs={
                            [
                                {
                                    headerName: "Название проекта",
                                    field: "projectName",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    checkboxSelection: true,
                                },
                                {
                                    headerName: "Дата создания",
                                    field: "createdAt",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    sort: 'desc',
                                    valueFormatter: this.dateFormatter,
                                },
                                {
                                    headerName: "Организация",
                                    field: "organizationName",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true
                                },
                                {
                                    headerName: "Комментарии",
                                    field: "comments",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true
                                },
                            ]
                        }
                        rowData={this.adminStore.projectsList}
                        modules={AllCommunityModules}
                        onGridSizeChanged={(ev) => ev.api.sizeColumnsToFit()}
                        floatingFilter={true}
                        rowSelection='single'
                        alwaysShowVerticalScroll={true}
                        onSelectionChanged={this.handleProjectSelected}
                    >
                    </AgGridReact>
                </div>
            </div>
        );
    }

    handleUserSelected = (event: SelectionChangedEvent) => {
        let selectedUser = event.api.getSelectedRows()[0] as UserName;
        if (selectedUser) {
            this.setState({ selectedUser: selectedUser })
        } else {
            this.setState({ selectedUser: null });
        }
    }

    handleAddUserToProject = () => {
        this.adminStore.addUserToProject(this.state.selectedProject!.projectId, this.state.selectedUserInDropdown!.id!)
        this.setState({ selectedProject: null, selectedUser: null, selectedUserInDropdown: null });
    }

    handleDeleteUserFromProject = () => {
        this.adminStore.deleteUserFromProject(this.state.selectedProject!.projectId, this.state.selectedUser!.userId!)
        this.setState({ selectedProject: null, selectedUser: null, selectedUserInDropdown: null });
    }

    private renderUsersList(): JSX.Element {
        return (
            <div className='users-list'>
                <div className='title'>Список пользователей в проекте</div>
                <div className='actions'>
                    <div className='selector'>
                        {this.renderUnsuedUsersList()}
                    </div>
                    <div className='add-user'>
                        <Button
                            disabled={this.state.selectedUserInDropdown === null}
                            onClick={this.handleAddUserToProject}
                            variant="success"
                        >
                            Добавить пользователя в проект
                         </Button>
                    </div>
                    <div className='remove-user'>
                        <Button
                            disabled={this.state.selectedUser === null}
                            onClick={this.handleDeleteUserFromProject}
                            variant="warning"
                        >
                            Исключить пользователя из проекта
                         </Button>
                    </div>
                </div>
                <div className='ag-theme-balham'>
                    <AgGridReact
                        columnDefs={
                            [
                                {
                                    headerName: "Email",
                                    field: "email",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    sort: 'asc',
                                    checkboxSelection: true,
                                },
                                {
                                    headerName: "Имя",
                                    field: "name",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true
                                }
                            ]
                        }
                        rowData={this.state.selectedProject ? this.state.selectedProject.assignedUsers : []}
                        modules={AllCommunityModules}
                        onGridSizeChanged={(ev) => ev.api.sizeColumnsToFit()}
                        floatingFilter={true}
                        rowSelection='single'
                        alwaysShowVerticalScroll={true}
                        onSelectionChanged={this.handleUserSelected}
                    >
                    </AgGridReact>
                </div>
            </div>
        );
    }

    private dateFormatter(params: { value: Date }): string {
        return formatDate(params.value);
    }
}