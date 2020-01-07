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
import { when } from 'mobx';
import { PlanningEditorEditor } from './PlanningEditor/PlanningEditor';
import { StoreEditor } from './StoreEditor/StoreEditor';
import { SupplyEditor } from './SupplyEditor/SupplyEditor';
import { ShipmentsEditor } from './ShipmentsEditor/ShipmentsEditor';
import { FinanceEditor } from './FinanceEditor/FinanceEditor';
import { CostsEditor } from './CostsEditor/CostsEditor';

enum EditFormsName {
    COMMON_INFO = 'Общая информация',
    PRODUCTS_AND_RESOURCES = 'Продукты и ресурсы в модели',
    PLANNING = 'Производство',
    STORE = 'Запасы',
    SHIPMENTS = 'Реализация',
    FINANCE = 'Финансы',
    SUPPLY = 'Снабжение',
    COSTS = 'Затраты'
}

interface IState {
    activeEditFormName: EditFormsName;
    isLoading: boolean;
}

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class TemplateEditor extends Component<{ stores?: StoresType }, IState> {
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
            activeEditFormName: EditFormsName.COSTS,
            isLoading: true
        };
    }

    componentDidMount() {
        let projectId = this.projectStore.currenProject.projectId;
        let templateId = getTemplateIdFromUrl(this.routerStore.location);
        this.templateStore.openTemplate(templateId);
        this.productStore.loadProducts(projectId);
        this.resourceStore.loadResources(projectId);

        when(
            () => !!this.templateStore.currentTemplate && !this.templateStore.isLoading && !this.projectStore.isLoading,
            () => this.setState({ isLoading: false })
        );
    }

    handleCreateTemplate = () => {
        this.templateStore.createTemplate(this.projectStore.currenProject.projectId);
    }

    handleSaveTemplate = async () => {
        this.setState({ isLoading: true });
        await this.templateStore.saveTemplate();
        this.setState({ isLoading: false });
    }

    public render(): JSX.Element {
        return (
            <div className='template-editor'>
                {this.state.isLoading
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
            case EditFormsName.PLANNING:
                return <PlanningEditorEditor />
            case EditFormsName.STORE:
                return <StoreEditor />
            case EditFormsName.SUPPLY:
                return <SupplyEditor />
            case EditFormsName.SHIPMENTS:
                return <ShipmentsEditor />
            case EditFormsName.FINANCE:
                return <FinanceEditor />
            case EditFormsName.COSTS:
                return <CostsEditor />
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
                    onClick={() => this.handleOpenEditor(EditFormsName.PLANNING)}
                    variant="success"
                    className='belsim-action-button'
                >
                    {EditFormsName.PLANNING}
                </Button>
                <Button
                    onClick={() => this.handleOpenEditor(EditFormsName.STORE)}
                    variant="success"
                    className='belsim-action-button'
                >
                    {EditFormsName.STORE}
                </Button>
                <Button
                    onClick={() => this.handleOpenEditor(EditFormsName.SHIPMENTS)}
                    variant="success"
                    className='belsim-action-button'
                >
                    {EditFormsName.SHIPMENTS}
                </Button>
                <Button
                    onClick={() => this.handleOpenEditor(EditFormsName.SUPPLY)}
                    variant="success"
                    className='belsim-action-button'
                >
                    {EditFormsName.SUPPLY}
                </Button>
                <Button
                    onClick={() => this.handleOpenEditor(EditFormsName.FINANCE)}
                    variant="success"
                    className='belsim-action-button'
                >
                    {EditFormsName.FINANCE}
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