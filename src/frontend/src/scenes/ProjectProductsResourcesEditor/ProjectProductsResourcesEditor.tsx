import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { AgGridReact } from '@ag-grid-community/react';
import { SelectionChangedEvent } from "@ag-grid-community/core";
import { AllCommunityModules } from '@ag-grid-community/all-modules';

import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';

import { RouterStore, ProductStore, StoresType, ResourceStore } from 'stores';
import './ProjectProductsResourcesEditor.scss';
import { getProjectIdFromUrl } from 'routes/getIdFromUrl';
import { Product, Resource } from 'models';
import { BelsimInput } from 'components/BelsimInput';
import { Button } from 'react-bootstrap';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class ProjectProductsResourcesEditor extends Component<{ stores?: StoresType }> {
    public productStore: ProductStore;
    public resourceStore: ResourceStore;
    public routerStore: RouterStore;

    constructor(props) {
        super(props);
        this.productStore = this.props.stores!.ProductStore;
        this.resourceStore = this.props.stores!.ResourceStore;
        this.routerStore = this.props.stores!.RouterStore;

        this.productStore.initProductNameEditorForm();
        this.resourceStore.initResourceNameEditorForm();
    }

    componentDidMount() {
        let projectId = getProjectIdFromUrl(this.routerStore.location);
        this.productStore.loadProducts(projectId);
        this.resourceStore.loadResources(projectId);
    }

    componentWillUnmount() {
        this.productStore.productNameEditorForm.dispose();
        this.resourceStore.resourceNameEditorForm.dispose();
    }

    handleProductRowSelected = (event: SelectionChangedEvent) => {
        let selectedProduct = event.api.getSelectedRows()[0] as Product;
        if (selectedProduct) {
            console.log((event.api.getSelectedRows()[0] as Product).productId);
            this.productStore.setProductNameEditorSelectedProduct(selectedProduct.productId);
        } else {
            this.productStore.setProductNameEditorSelectedProduct(null);
        }
    }

    handleCreateProduct = () => {
        this.productStore.createProductForProject();
    }
    handleDeleteProduct = () => {
        this.productStore.deleteProductFromProject();
    }

    handleResourceRowSelected = (event: SelectionChangedEvent) => {
        let selectedResource = event.api.getSelectedRows()[0] as Resource;
        if (selectedResource) {
            this.resourceStore.setResourceNameEditorSelectedResource(selectedResource.rkResourceId);
        } else {
            this.resourceStore.setResourceNameEditorSelectedResource(null);
        }
    }

    handleCreateResource = () => {
        this.resourceStore.createResourceForProject();
    }
    handleDeleteResource = () => {
        this.resourceStore.deleteResourceFromProject();
    }

    public render(): JSX.Element {
        return (
            <div className='project-products-resources-editor'>
                <div>Управление продуктами и ресурсами во всем проекте. Данные продукты/ресурсы будут доступны во всех шаблонах экспериментов</div>
                <div className='row'>
                    {this.renderProductsEditor()}
                    {this.renderResourcesEditor()}
                </div>
                <div className='help'>Нажмите на чекбокс для снятия выделения</div>
            </div>
        );
    }

    renderProductsEditor = () => {
        return (
            <div className='col-md-6'>
                <div className='title'>Продукты</div>
                <div className='item-editor'>
                    <BelsimInput
                        inputType='text'
                        formControl={this.productStore.productNameEditorForm.controls.name}
                        showErrors={this.productStore.productNameEditorForm.touched}
                        fieldName='Название продукта'
                        readonly={!!this.productStore.productNameEditorSelectedProduct.productId}
                    ></BelsimInput>
                </div>
                <div className='actions'>
                    <div className='create-button'>
                        <Button
                            variant='success'
                            size='sm'
                            onClick={this.handleCreateProduct}
                            disabled={!!this.productStore.productNameEditorSelectedProduct.productId || !this.productStore.productNameEditorForm.valid}
                        >Создать продукт</Button>
                    </div>
                    <div className='delete-button'>
                        <Button
                            variant='danger'
                            size='sm'
                            onClick={this.handleDeleteProduct}
                            disabled={!this.productStore.productNameEditorSelectedProduct.productId}
                        >Удалить продукт</Button>
                    </div>
                </div>
                <div className='ag-theme-balham'>
                    <AgGridReact
                        columnDefs={[{
                            headerName: "Ресурсы",
                            field: "name",
                            sortable: true,
                            filter: true,
                            suppressMovable: true,
                            checkboxSelection: true
                        }]}
                        rowData={this.productStore.allProducts}
                        modules={AllCommunityModules}
                        rowSelection='single'
                        onGridSizeChanged={(ev) => ev.api.sizeColumnsToFit()}
                        floatingFilter={true}
                        alwaysShowVerticalScroll={true}
                        onSelectionChanged={this.handleProductRowSelected}
                        rowDeselection={true}
                    >
                    </AgGridReact>
                </div>
            </div>
        );
    }

    renderResourcesEditor = () => {
        return (
            <div className='col-md-6'>
                <div className='title'>Ресурсы</div>
                <div className='item-editor'>
                    <BelsimInput
                        inputType='text'
                        formControl={this.resourceStore.resourceNameEditorForm.controls.name}
                        showErrors={this.resourceStore.resourceNameEditorForm.touched}
                        fieldName='Название ресурса'
                        readonly={!!this.resourceStore.resourceNameEditorSelectedResource.rkResourceId}
                    ></BelsimInput>
                </div>
                <div className='actions'>
                    <div className='create-button'>
                        <Button
                            variant='success'
                            size='sm'
                            onClick={this.handleCreateResource}
                            disabled={!!this.resourceStore.resourceNameEditorSelectedResource.rkResourceId || !this.resourceStore.resourceNameEditorForm.valid}
                        >Создать ресурс</Button>
                    </div>
                    <div className='delete-button'>
                        <Button
                            variant='danger'
                            size='sm'
                            onClick={this.handleDeleteResource}
                            disabled={!this.resourceStore.resourceNameEditorSelectedResource.rkResourceId}
                        >Удалить ресурс</Button>
                    </div>
                </div>
                <div className='ag-theme-balham'>
                    <AgGridReact
                        columnDefs={[{
                            headerName: "Продукты",
                            field: "name",
                            sortable: true,
                            filter: true,
                            suppressMovable: true,
                            checkboxSelection: true
                        }]}
                        rowData={this.resourceStore.allResources}
                        modules={AllCommunityModules}
                        rowSelection='single'
                        onGridSizeChanged={(ev) => ev.api.sizeColumnsToFit()}
                        floatingFilter={true}
                        alwaysShowVerticalScroll={true}
                        onSelectionChanged={this.handleResourceRowSelected}
                        rowDeselection={true}
                    >
                    </AgGridReact>
                </div>
            </div>
        );
    }
}