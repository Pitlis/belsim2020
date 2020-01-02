import { action, observable, runInAction, computed } from 'mobx';

import { RkExperimentTemplate } from 'models';
import { api } from 'repositories';
import { AbstractControls, FormControl, FormGroup, notEmptyOrSpaces } from '@quantumart/mobx-form-validation-kit';
import { stores } from 'stores';
import { routes, makeUrlWithParams } from 'routes';

interface ICommonInfoControl extends AbstractControls {
    name: FormControl<string>;
    description: FormControl<string>;
}

export const EMPTY_TEMPLATE_ID = 'new';

export class TemplateStore {
    @observable public currentTemplate: RkExperimentTemplate;
    @observable public isTemplateEmpty: boolean;
    @observable public isLoading: boolean;

    @observable public сommonInfoControlForm: FormGroup<ICommonInfoControl>;

    public constructor() {
        this.init();
    }

    @action
    public init(): void {
        this.isLoading = true;
    }

    @action
    public async openTemplate(templateId: string): Promise<void> {
        this.isLoading = true;
        if (templateId === EMPTY_TEMPLATE_ID) {
            console.log('openTemplate');
            this.currentTemplate = await api.template.getEmptyTemplate();
            runInAction(() => {
                this.isTemplateEmpty = true;
                this.isLoading = false;
            });
        } else {
            this.currentTemplate = await api.template.getTemplate(templateId);
            this.isTemplateEmpty = false;
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    @action
    public async createTemplate(projectId: string): Promise<void> {
        this.isLoading = true;
        if (this.сommonInfoControlForm.valid) {
            let templateId = await api.template.createTemplate(
                this.currentTemplate.name,
                this.currentTemplate.description,
                projectId
            );
            stores.RouterStore.push(makeUrlWithParams(routes.template.path, { templateId, projectId }));
            runInAction(() => {
                this.openTemplate(templateId);
            });
        }
    }

    @computed
    public get isTemplateValid(): boolean {
        console.log('isTemplateValid');
        if (!this.currentTemplate.rkExperimentTemplateId) {
            return (
                (this.сommonInfoControlForm ? this.сommonInfoControlForm.valid : true)
                && true
            );
        } else {            
            return (
                (this.сommonInfoControlForm ? this.сommonInfoControlForm.valid : true)
                && true
            );
        }
    }

    @action
    public initCommonInfoControlForm(): void {
        this.сommonInfoControlForm = new FormGroup<ICommonInfoControl>({
            name: new FormControl(
                this.currentTemplate.name,
                [notEmptyOrSpaces('SHOULD_NOT_BE_EMPTY')],
                v => (this.currentTemplate.name = v)
            ),
            description: new FormControl(
                this.currentTemplate.description,
                [],
                v => (this.currentTemplate.description = v)
            ),
        });
    }
}