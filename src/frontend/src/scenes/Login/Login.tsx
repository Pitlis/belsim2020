import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Form, Button, Card } from 'react-bootstrap';

import { RouterStore } from 'mobx-react-router';
import './Login.scss';

import { AuthStore, StoresType } from 'stores';
import { BelsimInput } from 'components/BelsimInput';
import { BelsimCheckbox } from 'components/BmailCheckbox';
import errorMessages from 'helpers/errorMessages';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class Login extends Component<{ stores: StoresType }> {
    public routerStore: RouterStore;
    public authStore: AuthStore;

    constructor(props) {
        super(props);
        this.routerStore = this.props.stores!.RouterStore;
        this.authStore = this.props.stores!.AuthStore;
        
        this.authStore.initUserCredentialsForm();
    }

    componentWillUnmount() {
        this.authStore.userCredentialsForm.dispose();
    }

    handleLogin = () => {
        this.authStore.login();
    }

    handleKeyPress = (target) => {
        if (target.charCode == 13) {
            this.handleLogin();
        }
    }

    public render(): JSX.Element {
        console.log(this.authStore.userCredentialsForm);
        return (
            <div className='login-scene'>
                <div className='login-form'>
                    <Card border='info'>
                        <Card.Body>
                            <Card.Title>Вход в BelSim2020</Card.Title>
                            <Form noValidate onKeyPress={this.handleKeyPress}>
                                <BelsimInput
                                    inputType='email'
                                    formControl={this.authStore.userCredentialsForm.controls.email}
                                    showErrors={this.authStore.userCredentialsForm.active}
                                    fieldName='Email'
                                ></BelsimInput>
                                <BelsimInput
                                    inputType='password'
                                    formControl={this.authStore.userCredentialsForm.controls.password}
                                    showErrors={this.authStore.userCredentialsForm.active}
                                    fieldName='Пароль'
                                ></BelsimInput>
                                <BelsimCheckbox
                                    formControl={this.authStore.userCredentialsForm.controls.rememberMe}
                                    showErrors={this.authStore.userCredentialsForm.active}
                                    fieldName='Запомнить меня'
                                    name='rememberMe'
                                ></BelsimCheckbox>
                                <div className='login-button'>
                                    <Button variant='info' size='sm' onClick={this.handleLogin}>Войти</Button>
                                </div>
                            </Form>
                            {this.authStore.loginErrors ? (this.authStore.loginErrors.map(e => <div className='error'>{errorMessages[e]}</div>)) : (null)}
                        </Card.Body>
                    </Card>
                </div>
            </div>
        );
    }
}