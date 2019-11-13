import { action, observable, runInAction, reaction } from 'mobx';
import { api } from 'repositories';
import { stores } from 'stores';
import { routes } from 'routes';

const REFRESHING_SESSION_TIME = 30000;

export class AuthStore {
    @observable public IsSignInChecked: boolean = false;
    @observable public isLoggedIn: boolean = false;
    @observable public IsLoginError: boolean = false;

    private refreshingTimer: NodeJS.Timer;

    public constructor() {
        reaction(() => this.isLoggedIn, (isLoggedIn) => {
            if (isLoggedIn) {
                console.log('start refresh session');
                this.startRefreshingSession();
            } else {
                console.log('stop refresh session');
                this.stopRefreshingSession();
            }
        });

        reaction(() => this.IsSignInChecked, (isSignInChecked) => {
            console.log('call reaction');
            if (isSignInChecked) {
                if (this.isLoggedIn) {
                    stores.RouterStore.push(routes.projects.path);
                } else {
                    stores.RouterStore.push(routes.main.path);
                }
            } else {
                this.setLoggedInState();
            }
        }, { fireImmediately: true });
    }

    @action
    public async login(email: string, password: string, rememberMe: boolean): Promise<void> {
        try {
            await api.account.login({ Email: email, Password: password, RememberMe: rememberMe });

            runInAction(() => {
                this.isLoggedIn = true;
                this.IsLoginError = false;
                stores.RouterStore.push(routes.projects.path);
            });
        } catch (err) {
            runInAction(() => {
                this.IsLoginError = true;
            });
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
            console.log('!!!!');
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
}

export const SomeGlobal = {
    someVal: 'value 1'
};