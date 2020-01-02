import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import './TemplateEditor.scss';

import { ProjectStore, RouterStore, TemplateStore, StoresType, ProductStore, ResourceStore } from 'stores';
import { getTemplateIdFromUrl } from 'routes/getIdFromUrl';
import { CommonInfoEditor } from './CommonInfoEditor/CommonInfoEditor';
import { BelsimLoader } from 'components/BelsimLoader';
import { Card, Button } from 'react-bootstrap';
import { ProductsAndResourcesInTemplate } from './ProductsAndResourcesInTemplate/ProductsAndResourcesInTemplate';
import { formatDate } from 'helpers/dateFormatter';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class TemplateEditor extends Component<{ stores?: StoresType }, { activeEditFormName: EditFormsName }> {
    public projectStore: ProjectStore;
    public routerStore: RouterStore;
    public templateStore: TemplateStore;
    public productStore: ProductStore;
    public resourceStore: ResourceStore;

    constructor(props) {
        super(props);
        this.projectStore = this.props.stores!.ProjectStore;
        this.routerStore = this.props.stores!.RouterStore;
        this.templateStore = this.props.stores!.TemplateStore;
        this.productStore = this.props.stores!.ProductStore;
        this.resourceStore = this.props.stores!.ResourceStore;

        this.state = {
            activeEditFormName: EditFormsName.PRODUCTS_AND_RESOURCES,
        }
    }

    componentDidMount() {
        let projectId = this.projectStore.currenProject.projectId;
        let templateId = getTemplateIdFromUrl(this.routerStore.location);
        this.templateStore.openTemplate(templateId);
        this.productStore.loadProducts(projectId);
        this.resourceStore.loadResources(projectId);
    }

    handleCreateTemplate = () => {
        this.templateStore.createTemplate(this.projectStore.currenProject.projectId);
    }

    handleSaveTemplate = async () => {
        await this.templateStore.saveTemplate();
    }

    public render(): JSX.Element {
        return (
            <div className='template-editor'>
                {this.templateStore.isLoading
                    ? <BelsimLoader />
                    : this.renderEditForm()
                }
            </div>
        );
    }

    private renderEditForm(): JSX.Element {
        return (
            <>
                {this.templateStore.isTemplateEmpty
                    ? this.renderTemplateCreating()
                    : this.renderTemplateSaving()}
                {this.templateStore.isTemplateEmpty
                    ? null
                    : this.renderEditorsList()}
                <div className='edit-form'>
                    <Card border='info' className='editor'>
                        <Card.Body>
                            <Card.Title>{this.state.activeEditFormName}</Card.Title>
                            {this.renderEditComponent()}
                        </Card.Body>
                    </Card>
                </div>
            </>
        );
    }

    private renderEditComponent(): JSX.Element | null {
        switch (this.state.activeEditFormName) {
            case EditFormsName.COMMON_INFO:
                return <CommonInfoEditor />
            case EditFormsName.PRODUCTS_AND_RESOURCES:
                return <ProductsAndResourcesInTemplate />
            default:
                return null;
        }
    }

    private renderTemplateSaving(): JSX.Element {
        return (
            <div className='template-saving'>
                <span className='change-time'>Последнее сохранение: <b>{formatDate(this.templateStore.currentTemplate.modifiedAt)}</b></span>
                <Button
                    disabled={!this.templateStore.isTemplateValid}
                    onClick={this.handleSaveTemplate}
                    variant="success"
                    className='belsim-action-button'
                >
                    Сохранить
                </Button>
            </div>
        );
    }

    private renderTemplateCreating(): JSX.Element {
        return (
            <div className='template-saving'>
                <Button
                    disabled={!this.templateStore.isTemplateValid}
                    onClick={this.handleCreateTemplate}
                    variant="success"
                    className='belsim-action-button'
                >
                    Создать
                </Button>
            </div>
        );
    }

    handleOpenEditor = (editFormName: EditFormsName) => {
        this.setState({ activeEditFormName: editFormName });
    }

    private renderEditorsList(): JSX.Element {
        return (
            <div className='editors-list'>
                <Button
                    onClick={() => this.handleOpenEditor(EditFormsName.COMMON_INFO)}
                    variant="success"
                    className='belsim-action-button'
                >
                    {EditFormsName.COMMON_INFO}
                </Button>
                <Button
                    onClick={() => this.handleOpenEditor(EditFormsName.PRODUCTS_AND_RESOURCES)}
                    variant="success"
                    className='belsim-action-button'
                >
                    {EditFormsName.PRODUCTS_AND_RESOURCES}
                </Button>
                <Button
                    onClick={() => this.handleOpenEditor(EditFormsName.COMMON_INFO)}
                    variant="success"
                    className='belsim-action-button'
                >
                    {EditFormsName.COMMON_INFO}
                </Button>
                <Button
                    onClick={() => this.handleOpenEditor(EditFormsName.PRODUCTS_AND_RESOURCES)}
                    variant="success"
                    className='belsim-action-button'
                >
                    {EditFormsName.PRODUCTS_AND_RESOURCES}
                </Button>
                <Button
                    onClick={() => this.handleOpenEditor(EditFormsName.COMMON_INFO)}
                    variant="success"
                    className='belsim-action-button'
                >
                    {EditFormsName.COMMON_INFO}
                </Button>
                <Button
                    onClick={() => this.handleOpenEditor(EditFormsName.PRODUCTS_AND_RESOURCES)}
                    variant="success"
                    className='belsim-action-button'
                >
                    {EditFormsName.PRODUCTS_AND_RESOURCES}
                </Button>
                <Button
                    onClick={() => this.handleOpenEditor(EditFormsName.COMMON_INFO)}
                    variant="success"
                    className='belsim-action-button'
                >
                    {EditFormsName.COMMON_INFO}
                </Button>
                <Button
                    onClick={() => this.handleOpenEditor(EditFormsName.PRODUCTS_AND_RESOURCES)}
                    variant="success"
                    className='belsim-action-button'
                >
                    {EditFormsName.PRODUCTS_AND_RESOURCES}
                </Button>
            </div>
        );
    }
}

enum EditFormsName {
    COMMON_INFO = 'Общая информация',
    PRODUCTS_AND_RESOURCES = 'Продукты и ресурсы в модели'
}