import { action, observable, runInAction, reaction, computed } from 'mobx';
import {
    FormControl,
    FormGroup,
    AbstractControls,
    pattern,
    notEmptyOrSpaces
} from "@quantumart/mobx-form-validation-kit";
import { api } from 'repositories';
import { stores } from 'stores';
import { routes } from 'routes';

const REFRESHING_SESSION_TIME = 30000;
const EMAIL_VALIDATION_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const ADMIN_ROLE = 'admin';


interface IUserCredentials extends AbstractControls {
    email: FormControl<string>;
    password: FormControl<string>;
    rememberMe: FormControl<boolean>;
}

export class AuthStore {
    @observable public IsSignInChecked: boolean = false;
    @observable public isLoggedIn: boolean = false;
    @observable public userCredentials = {
        email: '',
        password: '',
        rememberMe: false
    };
    @observable public userCredentialsForm: FormGroup<IUserCredentials>;
    @observable public isLoginButtonClicked: boolean = false;
    @observable public loginErrors: string[];

    @observable public roles: string[];

    private refreshingTimer: NodeJS.Timer;

    public constructor() {
        reaction(() => this.isLoggedIn, (isLoggedIn) => {
            if (isLoggedIn) {
                this.startRefreshingSession();
            } else {
                this.stopRefreshingSession();
            }
        });

        reaction(() => this.IsSignInChecked, (isSignInChecked) => {
            if (isSignInChecked) {
                if (this.isLoggedIn) {
                    this.redirectToStartPageAfterLogin();
                } else {
                    stores.RouterStore.push(routes.login.path);
                }
            } else {
                this.setLoggedInState();
            }
        }, { fireImmediately: true });

        this.roles = [];
    }

    @action
    public initUserCredentialsForm(): void {
        this.userCredentialsForm = new FormGroup<IUserCredentials>({
            email: new FormControl(
                this.userCredentials.email,
                [
                    pattern(EMAIL_VALIDATION_PATTERN, 'INVALID_EMAIL')
                ],
                v => (this.userCredentials.email = v)
            ),
            password: new FormControl(
                this.userCredentials.password,
                [notEmptyOrSpaces('INVALID_PASSWORD')],
                v => (this.userCredentials.password = v)
            ),
            rememberMe: new FormControl(
                this.userCredentials.rememberMe,
                [],
                v => (this.userCredentials.rememberMe = v)
            )
        },
            [],
            () => this.isLoginButtonClicked
        );
    }

    @action
    public async loadUserRoles(): Promise<void> {
        try {
            this.roles = await api.account.getRoles();
        } catch (err) {
            console.log(err);
        }
    }

    @computed
    public get isAdmin(): boolean {
        return !!this.roles.find(r => r === ADMIN_ROLE);
    }

    @action
    public async login(): Promise<void> {
        this.isLoginButtonClicked = true;
        if (this.userCredentialsForm.valid) {
            try {
                await api.account.login({
                    Email: this.userCredentials.email,
                    Password: this.userCredentials.password,
                    RememberMe: this.userCredentials.rememberMe
                });

                runInAction(() => {
                    this.userCredentialsForm.controls.email.value = '';
                    this.userCredentialsForm.controls.password.value = '';
                    this.userCredentialsForm.controls.rememberMe.value = false;

                    this.isLoggedIn = true;
                    this.loadUserRoles();
                    stores.RouterStore.push(routes.projects.path);
                });
            } catch (err) {
                runInAction(() => {
                    this.userCredentialsForm.controls.password.value = '';
                    this.isLoginButtonClicked = false;
                    if (err.response && err.response.data && err.response.data.Errors) {
                        this.loginErrors = err.response.data.Errors;
                    } else {
                        this.loginErrors = ['CONNECTION_FAILED'];
                    }
                });
            }
        }
    }

    @action
    public async logout(): Promise<void> {
        try {
            await api.account.logout();

            runInAction(() => {
                this.isLoggedIn = false;
            });

        } catch (err) {
            console.log(err);
        }
    }

    @action
    public async setLoggedInState(): Promise<void> {
        try {
            await api.account.refreshSession();
            runInAction(() => {
                this.isLoggedIn = true;
                this.IsSignInChecked = true;
                this.loadUserRoles();
            });
        } catch (err) {
            runInAction(() => {
                this.isLoggedIn = false;
                this.IsSignInChecked = true;
            });
        }
    }

    private startRefreshingSession(): void {
        this.stopRefreshingSession();

        this.refreshingTimer = setInterval(
            () => api.account.refreshSession(),
            REFRESHING_SESSION_TIME
        );
    }

    private stopRefreshingSession(): void {
        if (this.refreshingTimer) {
            clearInterval(this.refreshingTimer);
        }
    }

    private redirectToStartPageAfterLogin(): void {
        if (stores.RouterStore.location.pathname === routes.login.path) {
            stores.RouterStore.push(routes.projects.path);
        } else {
            stores.RouterStore.push(stores.RouterStore.location.pathname);
        }
    }
}

export const SomeGlobal = {
    someVal: 'value 1'
};