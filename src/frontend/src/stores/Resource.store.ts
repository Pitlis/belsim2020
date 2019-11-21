import { action, observable, runInAction } from 'mobx';

import { Resource } from 'models';
import { api } from 'repositories';
import { FormGroup, AbstractControls, FormControl, notEmptyOrSpaces, ValidationEvent, ValidationEventTypes } from '@quantumart/mobx-form-validation-kit';

interface IResourceNameEditor extends AbstractControls {
    name: FormControl<string>;
}
export class ResourceStore {
    @observable public allResources: Resource[];

    @observable public resourceNameEditorForm: FormGroup<IResourceNameEditor>;
    @observable public resourceNameEditorSelectedResource: Resource;
    @observable public serverErrorMessage: string;

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
            console.log('loadResources');
            let resources = await api.resource.getProjectResources(projectId);
            console.log(resources);

            runInAction(() => {
                this.allResources = resources.sort((r1, r2) => r1.Name.localeCompare(r2.Name));
            });
        } catch (err) {
            runInAction(() => {
                this.serverErrorMessage = err;
            });
        }
    }

    @action
    public initResourceNameEditorForm(): void {
        this.resourceNameEditorSelectedResource = new Resource();
        this.resourceNameEditorForm = new FormGroup<IResourceNameEditor>({
            name: new FormControl(
                this.resourceNameEditorSelectedResource.Name,
                [
                    notEmptyOrSpaces('NAME_CANNOT_BE_EMPTY'),
                    (control: FormControl) => this.validateNameDublicates(control)
                ],
                v => (this.resourceNameEditorSelectedResource.Name = v)
            ),
        });
    }

    @action
    public setResourceNameEditorSelectedResource(resourceId: string | null): void {
        if (resourceId !== null) {
            let selectedResource = this.allResources.find(p => p.RkResourceId === resourceId);
            this.resourceNameEditorSelectedResource = !!selectedResource ? selectedResource : new Resource();
            this.resourceNameEditorForm.controls.name.value = this.resourceNameEditorSelectedResource.Name;
        } else {
            this.resourceNameEditorSelectedResource = new Resource();
        }
    }

    @action
    public async createResourceForProject(): Promise<void> {
        try {
            console.log('loadResources');
            await api.resource.createResource(this.resourceNameEditorSelectedResource.Name, this.projectId);

            runInAction(() => {
                this.loadResources(this.projectId);
                this.resourceNameEditorSelectedResource = new Resource();
                this.resourceNameEditorForm.controls.name.value = '';
                this.resourceNameEditorForm.controls.name.setTouched(false);
            });
        } catch (err) {
            runInAction(() => {
                this.serverErrorMessage = err;
            });
        }
    }

    @action
    public async deleteResourceFromProject(): Promise<void> {
        try {
            console.log('loadResources');
            await api.resource.deleteResource(this.resourceNameEditorSelectedResource.RkResourceId);

            runInAction(() => {
                this.loadResources(this.projectId);
                this.resourceNameEditorSelectedResource = new Resource();
            });
        } catch (err) {
            runInAction(() => {
                this.serverErrorMessage = err;
            });
        }
    }


    // Helpers
    private async validateNameDublicates(control: FormControl): Promise<ValidationEvent[]> {
        console.log('validateNameDublicates');
        console.log(this.resourceNameEditorSelectedResource.RkResourceId);
        if (control.value == null || this.resourceNameEditorSelectedResource.RkResourceId) {
            return [];
        }
        if (this.allResources.find(r => r.Name.toLowerCase() === control.value.toLowerCase())) {
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