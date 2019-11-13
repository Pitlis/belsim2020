import React, { Component, createRef, RefObject } from 'react';
import { observer, inject } from 'mobx-react';
import { Form, Button, Card } from 'react-bootstrap';

import { RouterStore } from 'mobx-react-router';
import './Login.scss';

import { AuthStore } from 'stores';

interface State {
    emailInput: FormInput,
    passwordInput: FormInput,
    rememberMeInput: FormInput
}

interface FormInput {
    isValidated: boolean,
    isValid: boolean,
    errorMessage: string,
    ref: RefObject<HTMLInputElement>
}

@inject(RouterStore.name, AuthStore.name)
@observer
export class Login extends Component<{}, State> {
    public routerStore: RouterStore;
    public authStore: AuthStore;

    // private emailInputRef = createRef<FormControl>();
    // private passwordInputRef = createRef<HTMLInputElement>();

    constructor(props) {
        super(props);
        this.routerStore = props[RouterStore.name];
        this.authStore = props[AuthStore.name];

        this.state = {
            emailInput: { isValidated: false, isValid: false, errorMessage: '', ref: createRef<HTMLInputElement>() },
            passwordInput: { isValidated: false, isValid: false, errorMessage: '', ref: createRef<HTMLInputElement>() },
            rememberMeInput: { isValidated: false, isValid: false, errorMessage: '', ref: createRef<HTMLInputElement>() },
        };
    }

    componentDidMount() {
    }

    handleLogin = () => {
        console.log('handle login');
        console.log(this.state.emailInput.ref.current!.value.length);
        this.setState({
            emailInput: {
                ...this.state.emailInput,
                isValid: (this.isInputValid(this.state.emailInput) && !!this.getInputValue(this.state.emailInput).length),
                isValidated: true,
                errorMessage: 'некорректный email'
            },
            passwordInput: {
                ...this.state.passwordInput,
                isValid: (this.isInputValid(this.state.passwordInput) && !!this.getInputValue(this.state.emailInput).length),
                isValidated: true,
                errorMessage: 'пароль не должен быть пустым'
            }
        }, () => {
            if (this.state.emailInput.isValid && this.state.passwordInput.isValid) {
                let email = this.getInputValue(this.state.emailInput);
                let password = this.getInputValue(this.state.passwordInput);
                let rememberMe = this.state.rememberMeInput.ref.current!.checked;
                this.authStore.login(email, password, rememberMe);
            }
        });
    }

    handleKeyPress = (target) => {
        if (target.charCode == 13) {
            this.handleLogin();
        }
    }

    handleChangeInput = (ev) => {
        console.log(ev.target.id);
        console.log(ev.target.value);
    }

    isInputValid = (input: FormInput): boolean => {
        return input.ref.current!.validity.valid;
    }

    getInputValue = (input: FormInput): string => {
        return input.ref.current!.value;
    }

    public render(): JSX.Element {
        return (
            <div className='login-scene'>
                <div className='login-form'>
                    <Card border='info'>
                        <Card.Body>
                            <Card.Title>Вход в BelSim2020</Card.Title>
                            <Form noValidate onKeyPress={this.handleKeyPress}>
                                <Form.Group controlId='email'>
                                    <Form.Control
                                        size='sm'
                                        type='email'
                                        placeholder='Введите email'
                                        ref={this.state.emailInput.ref as RefObject<any>}
                                        isInvalid={this.state.emailInput.isValidated && !this.state.emailInput.isValid}
                                    />
                                    <Form.Control.Feedback type="invalid">{this.state.emailInput.errorMessage}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId='password'>
                                    <Form.Control
                                        size='sm'
                                        type='password'
                                        placeholder='Введите пароль'
                                        ref={this.state.passwordInput.ref as RefObject<any>}
                                        isInvalid={this.state.passwordInput.isValidated && !this.state.passwordInput.isValid}
                                    />
                                    <Form.Control.Feedback type="invalid">{this.state.passwordInput.errorMessage}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId='formBasicCheckbox'>
                                    <Form.Check
                                        type='checkbox'
                                        label='Запомнить меня'
                                        ref={this.state.rememberMeInput.ref as RefObject<any>}
                                    />
                                </Form.Group>
                                {this.authStore.IsLoginError ? (
                                    <div className="error-login-message">
                                        Введен неправильный email или пароль
                                    </div>
                                ) : (null)}
                                <div className='login-button'>
                                    <Button variant='info' size='sm' onClick={this.handleLogin}>Войти</Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        );
    }
}