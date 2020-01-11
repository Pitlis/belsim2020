import { action, observable, runInAction } from 'mobx';
import { FormControl, AbstractControls, FormGroup, pattern, minLength, maxLength, notEmptyOrSpaces } from '@quantumart/mobx-form-validation-kit';
import { UserProfile } from 'models';
import { api } from 'repositories';
import { stores } from 'stores';

var EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface IUserProfileControl extends AbstractControls {
    email: FormControl<string>;
    publicName: FormControl<string>;
    organizationName: FormControl<string>;
    comments: FormControl<string>;
    password: FormControl<string>;
}

interface IChangePasswordControl extends AbstractControls {
    password: FormControl<string>;
}

export class AdminStore {
    @observable public isLoading: boolean;
    @observable public newUserProfile: any;
    @observable public usersList: UserProfile[];
    @observable public newPassword: string;

    @observable public userProfileControlForm: FormGroup<IUserProfileControl>;
    @observable public changePasswordControlForm: FormGroup<IChangePasswordControl>;


    public constructor() {
        this.init();
    }

    @action
    public init(): void {
        this.newUserProfile = {
            email: '',
            publicName: '',
            organizationName: '',
            comments: '',
            password: ''
        };
    }

    @action
    public async loadUsers(): Promise<void> {
        this.isLoading = true;
        try {
            this.usersList = await api.admin.getUsers();
            runInAction(() => {
                this.isLoading = false;
            });
        } catch (err) {
            console.log(err);
            stores.ErrorStore.addError('Ошибка загрузки списка пользователей. Попробуйте обновить страницу.')
        }
    }

    @action
    public async createUser(): Promise<void> {
        this.isLoading = true; try {
            await api.admin.createUser(
                this.newUserProfile.email,
                this.newUserProfile.publicName,
                this.newUserProfile.password,
                this.newUserProfile.organizationName,
                this.newUserProfile.comments
            );
            runInAction(() => {
                this.loadUsers();
                this.newUserProfile = {
                    email: '',
                    publicName: '',
                    organizationName: '',
                    comments: '',
                    password: ''
                };
                this.userProfileControlForm.dispose();
                this.initUserProfileControlForm();
            });
        } catch (err) {
            console.log(err);
            stores.ErrorStore.addError('Ошибка создания пользователя. Попробуйте снова.')
        }
    }

    @action
    public async changePassword(userId: string, password: string): Promise<void> {
        this.isLoading = true; try {
            await api.admin.changePassword(
                userId,
                password
            );
            runInAction(() => {
                this.loadUsers();
                this.newUserProfile = {
                    email: '',
                    publicName: '',
                    organizationName: '',
                    comments: '',
                    password: ''
                };
                this.newPassword = '';
                this.userProfileControlForm.dispose();
                this.initUserProfileControlForm();
                this.changePasswordControlForm.dispose();
                this.initChangePasswordControlForm();
            });
        } catch (err) {
            console.log(err);
            stores.ErrorStore.addError('Ошибка смены пароля. Попробуйте снова.')
        }
    }

    // controls

    @action
    public initUserProfileControlForm(): void {
        this.userProfileControlForm = new FormGroup<IUserProfileControl>({
            email: new FormControl(
                this.newUserProfile.email,
                [
                    notEmptyOrSpaces('SHOULD_NOT_BE_EMPTY'),
                    pattern(EMAIL_PATTERN, 'INVALID_EMAIL')
                ],
                v => (this.newUserProfile.email = v)
            ),
            publicName: new FormControl(
                this.newUserProfile.publicName,
                [
                    notEmptyOrSpaces('SHOULD_NOT_BE_EMPTY'),
                    minLength(3, 'TOO_SHORT'),
                    maxLength(30, 'TOO_LONG')
                ],
                v => (this.newUserProfile.publicName = v)
            ),
            organizationName: new FormControl(
                this.newUserProfile.organizationName,
                [
                    maxLength(30, 'TOO_LONG')
                ],
                v => (this.newUserProfile.organizationName = v)
            ),
            comments: new FormControl(
                this.newUserProfile.comments,
                [],
                v => (this.newUserProfile.comments = v)
            ),
            password: new FormControl(
                this.newUserProfile.password,
                [
                    notEmptyOrSpaces('SHOULD_NOT_BE_EMPTY'),
                    minLength(6, 'TOO_SHORT'),
                    maxLength(30, 'TOO_LONG')
                ],
                v => (this.newUserProfile.password = v)
            ),
        });
    }

    @action
    public initChangePasswordControlForm(): void {
        this.changePasswordControlForm = new FormGroup<IChangePasswordControl>({
            password: new FormControl(
                this.newPassword,
                [
                    notEmptyOrSpaces('SHOULD_NOT_BE_EMPTY'),
                    minLength(6, 'TOO_SHORT'),
                    maxLength(30, 'TOO_LONG')
                ],
                v => (this.newPassword = v)
            ),
        });
    }
}
