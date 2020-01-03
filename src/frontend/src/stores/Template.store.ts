import { action, observable, runInAction, computed } from 'mobx';

import { RkExperimentTemplate, RkExperimentTemplateInfo } from 'models';
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
    @observable public productIdsInCurrentTemplate: string[];
    @observable public resourceIdsInCurrentTemplate: string[];
    @observable public isTemplateEmpty: boolean;
    @observable public isLoading: boolean;
    @observable public productResourceListChanged: boolean;

    @observable public сommonInfoControlForm: FormGroup<ICommonInfoControl>;

    @observable public templatesInProject: RkExperimentTemplateInfo[];

    public constructor() {
        this.init();
    }

    @action
    public init(): void {
        this.isLoading = true;
        this.productResourceListChanged = false;
        this.productIdsInCurrentTemplate = new Array<string>();
        this.resourceIdsInCurrentTemplate = new Array<string>();
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
            runInAction(() => {
                this.isTemplateEmpty = false;
                this.productIdsInCurrentTemplate = this.currentTemplate.products.map(p => p.productId);
                this.resourceIdsInCurrentTemplate = this.currentTemplate.resources.map(p => p.resourceId);
                this.productResourceListChanged = false;
                this.isLoading = false;
            });
        }
    }

    @action
    public async loadProjectTemplatesList(projectId: string): Promise<void> {
        this.isLoading = true;
        this.templatesInProject = await api.template.getProjectTemplates(projectId);
        runInAction(() => {
            this.isLoading = false;
        });
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

    @action
    public addProductToTemplateList(productId: string) {
        console.log(productId);
        this.productIdsInCurrentTemplate.push(productId);
        this.productResourceListChanged = true;
    }

    @action
    public removeProductFromTemplateList(productId: string) {
        this.productIdsInCurrentTemplate = this.productIdsInCurrentTemplate.filter(id => id !== productId);
        this.productResourceListChanged = true;
    }

    @action
    public addResourceToTemplateList(resourceId: string) {
        this.resourceIdsInCurrentTemplate.push(resourceId);
        this.productResourceListChanged = true;
    }

    @action
    public removeResourceFromTemplateList(resourceId: string) {
        this.resourceIdsInCurrentTemplate = this.resourceIdsInCurrentTemplate.filter(id => id !== resourceId);
        this.productResourceListChanged = true;
    }

    @action
    public async saveTemplate() {
        this.isLoading = true;

        await api.template.updateTemplate(this.currentTemplate);
        console.log(this.productResourceListChanged);
        if (this.productResourceListChanged) {
            await api.template.updateProductsList(this.currentTemplate.rkExperimentTemplateId, this.productIdsInCurrentTemplate);
            await api.template.updateResourcesList(this.currentTemplate.rkExperimentTemplateId, this.resourceIdsInCurrentTemplate);
        }
        runInAction(() => {
            this.openTemplate(this.currentTemplate.rkExperimentTemplateId);
        });
    }
}