import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules, SelectionChangedEvent } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import { Form, Button } from 'react-bootstrap';

import './UsersEditor.scss';

import { AdminStore, StoresType } from 'stores';
import { BelsimInput } from 'components/BelsimInput';
import { BelsimLoader } from 'components/BelsimLoader';
import { UserProfile } from 'models';


interface IState {
    selectedUser: UserProfile | null;
}

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class UsersEditor extends Component<{ stores?: StoresType }, IState> {
    public adminStore: AdminStore;

    constructor(props) {
        super(props);
        this.adminStore = this.props.stores!.AdminStore;

        this.state = {
            selectedUser: null
        }

        this.adminStore.initUserProfileControlForm();
        this.adminStore.initChangePasswordControlForm();
    }

    componentDidMount() {
        this.adminStore.loadUsers();
    }

    componentWillUnmount() {
        this.adminStore.userProfileControlForm.dispose();
        this.adminStore.changePasswordControlForm.dispose();
    }

    public render(): JSX.Element {
        return (
            <div className='users-editor'>
                {this.renderEditUserForm()}
                <hr />
                {
                    (this.adminStore.isLoading || this.adminStore.usersList === undefined)
                        ? <BelsimLoader />
                        : this.renderUsersList()
                }
                <hr />
                {this.state.selectedUser && this.renderPasswordChange()}
            </div>
        );
    }

    handleCreateUser = async () => {
        await this.adminStore.createUser();
        this.setState({ selectedUser: null });
    }

    private renderEditUserForm(): JSX.Element {
        return (
            <div className='block-editor create-user'>
                <div className='title'>Создание пользователей</div>
                <div className='content'>
                    <Form noValidate>
                        <BelsimInput
                            inputType='text'
                            formControl={this.adminStore.userProfileControlForm.controls.email}
                            showErrors={this.adminStore.userProfileControlForm.controls.email.touched}
                            fieldName='Email:'
                            className='name'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='text'
                            formControl={this.adminStore.userProfileControlForm.controls.publicName}
                            showErrors={this.adminStore.userProfileControlForm.controls.publicName.touched}
                            fieldName='Имя:'
                            className='name'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='text'
                            formControl={this.adminStore.userProfileControlForm.controls.password}
                            showErrors={this.adminStore.userProfileControlForm.controls.password.touched}
                            fieldName='Пароль:'
                            className='name'
                        ></BelsimInput>
                    </Form>
                    <Form noValidate>
                        <BelsimInput
                            inputType='text'
                            formControl={this.adminStore.userProfileControlForm.controls.organizationName}
                            showErrors={this.adminStore.userProfileControlForm.controls.organizationName.touched}
                            fieldName='Название организации:'
                            className='name'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='text'
                            formControl={this.adminStore.userProfileControlForm.controls.comments}
                            showErrors={this.adminStore.userProfileControlForm.controls.comments.touched}
                            fieldName='Комментарии (доступны только администраторам):'
                            className='name'
                        ></BelsimInput>
                        <div className='create-user-button'>
                            <Button
                                disabled={this.adminStore.userProfileControlForm.invalid}
                                onClick={this.handleCreateUser}
                                variant="success"
                            >
                                Создать пользователя
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }

    handleUserSelected = (event: SelectionChangedEvent) => {
        let selectedUser = event.api.getSelectedRows()[0] as UserProfile;
        if (selectedUser) {
            this.setState({ selectedUser: selectedUser })
        } else {
            this.setState({ selectedUser: null });
        }
    }

    private renderUsersList(): JSX.Element {
        return (
            <div className='users-list'>
                <div className='title'>Список пользователей</div>
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
                                    field: "publicName",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    sort: 'asc'
                                },
                                {
                                    headerName: "Организация",
                                    field: "organizationName",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    sort: 'asc'
                                },
                                {
                                    headerName: "Комментарии",
                                    field: "comments",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    sort: 'asc'
                                },
                            ]
                        }
                        rowData={this.adminStore.usersList}
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

    handleChangePassword = async () => {
        await this.adminStore.changePassword(this.state.selectedUser!.id!, this.adminStore.newPassword);
        this.setState({ selectedUser: null });
    }

    private renderPasswordChange(): JSX.Element {
        return (
            <div className='password-change'>
                <div className='title'>Смена пароля</div>
                <div className='content'>
                    <Form noValidate>
                        <BelsimInput
                            inputType='text'
                            formControl={this.adminStore.changePasswordControlForm.controls.password}
                            showErrors={this.adminStore.changePasswordControlForm.controls.password.touched}
                            fieldName='Новый пароль:'
                            className='name'
                        ></BelsimInput>
                    </Form>
                    <Button
                        disabled={this.adminStore.changePasswordControlForm.invalid}
                        onClick={this.handleChangePassword}
                        variant="success"
                    >
                        Сохранить новый пароль
                 </Button>
                </div>
            </div>
        );
    }
}