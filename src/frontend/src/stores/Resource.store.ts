import { action, observable, runInAction } from 'mobx';

import { Resource } from 'models';
import { api } from 'repositories';
import { FormGroup, AbstractControls, FormControl, notEmptyOrSpaces, ValidationEvent, ValidationEventTypes } from '@quantumart/mobx-form-validation-kit';
import { stores } from 'stores';

interface IResourceNameEditor extends AbstractControls {
    name: FormControl<string>;
}
export class ResourceStore {
    @observable public allResources: Resource[];

    @observable public resourceNameEditorForm: FormGroup<IResourceNameEditor>;
    @observable public resourceNameEditorSelectedResource: Resource;

    private projectId: string;

    public constructor() {
        this.init();
    }

    @action
    public init(): void {
        this.allResources = new Array<Resource>();
    }

    @action
    public async loadResources(projectId: string): Promise<void> {
        this.projectId = projectId;
        try {
            let resources = await api.resource.getProjectResources(projectId);

            runInAction(() => {
                this.allResources = resources.sort((r1, r2) => r1.name.localeCompare(r2.name));
            });
        } catch (err) {
            console.log(err);
            stores.ErrorStore.addError('Ошибка загрузки списка ресурсов. Попробуйте обновить страницу.');
        }
    }

    @action
    public initResourceNameEditorForm(): void {
        this.resourceNameEditorSelectedResource = new Resource();
        this.resourceNameEditorForm = new FormGroup<IResourceNameEditor>({
            name: new FormControl(
                this.resourceNameEditorSelectedResource.name,
                [
                    notEmptyOrSpaces('NAME_CANNOT_BE_EMPTY'),
                    (control: FormControl) => this.validateNameDublicates(control)
                ],
                v => (this.resourceNameEditorSelectedResource.name = v)
            ),
        });
    }

    @action
    public setResourceNameEditorSelectedResource(resourceId: string | null): void {
        if (resourceId !== null) {
            let selectedResource = this.allResources.find(p => p.rkResourceId === resourceId);
            this.resourceNameEditorSelectedResource = !!selectedResource ? selectedResource : new Resource();
            this.resourceNameEditorForm.controls.name.value = this.resourceNameEditorSelectedResource.name;
        } else {
            this.resourceNameEditorSelectedResource = new Resource();
        }
    }

    @action
    public async createResourceForProject(): Promise<void> {
        try {
            await api.resource.createResource(this.resourceNameEditorSelectedResource.name, this.projectId);

            runInAction(() => {
                this.loadResources(this.projectId);
                this.resourceNameEditorSelectedResource = new Resource();
                this.resourceNameEditorForm.controls.name.value = '';
                this.resourceNameEditorForm.controls.name.setTouched(false);
            });
        } catch (err) {
            console.log(err);
            stores.ErrorStore.addError('Ошибка создания ресурса. Попробуйте снова.');
        }
    }

    @action
    public async deleteResourceFromProject(): Promise<void> {
        try {
            await api.resource.deleteResource(this.resourceNameEditorSelectedResource.rkResourceId);

            runInAction(() => {
                this.loadResources(this.projectId);
                this.resourceNameEditorSelectedResource = new Resource();
            });
        } catch (err) {
            console.log(err);
            stores.ErrorStore.addError('Ошибка удаления ресурса. Возможно этот ресурс уже используется в моделях данных - тогда сначала удалите оттуда.');
        }
    }


    public getResourceName(resourceId: string) {
        let resource = this.allResources.find(p => p.rkResourceId === resourceId);
        return resource ? resource.name : '[не найдено]';
    }


    // Helpers
    private async validateNameDublicates(control: FormControl): Promise<ValidationEvent[]> {
        if (control.value == null || this.resourceNameEditorSelectedResource.rkResourceId) {
            return [];
        }
        if (this.allResources.find(r => r.name.toLowerCase() === control.value.toLowerCase())) {
            return [
                {
                    message: 'NAME_CANNOT_BE_DUBLICATED',
                    type: ValidationEventTypes.Error,
                },
            ];
        }
        return [];
    }
}