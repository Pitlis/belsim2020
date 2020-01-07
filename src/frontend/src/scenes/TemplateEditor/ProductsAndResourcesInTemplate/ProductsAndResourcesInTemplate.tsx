import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { AgGridReact } from '@ag-grid-community/react';
import { SelectionChangedEvent } from "@ag-grid-community/core";
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';

import './ProductsAndResourcesInTemplate.scss';

import { TemplateStore, StoresType, ProjectStore, ProductStore, ResourceStore } from 'stores';

import Select from 'react-select'
import { Product, Resource } from 'models';
import { Button } from 'react-bootstrap';

interface IState {
    selectedProductInDropdown: Product | null;
    selectedResourceInDropdown: Resource | null;
    selectedProductInTemplate: Product | null;
    selectedResourceInTemplate: Resource | null;
}

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class ProductsAndResourcesInTemplate extends Component<{ stores?: StoresType }, IState> {

    public templateStore: TemplateStore;
    public projectStore: ProjectStore;
    public productStore: ProductStore;
    public resourceStore: ResourceStore;

    constructor(props) {
        super(props);
        this.templateStore = this.props.stores!.TemplateStore;
        this.projectStore = this.props.stores!.ProjectStore;
        this.productStore = this.props.stores!.ProductStore;
        this.resourceStore = this.props.stores!.ResourceStore;

        this.state = {
            selectedProductInDropdown: null,
            selectedResourceInDropdown: null,
            selectedProductInTemplate: null,
            selectedResourceInTemplate: null
        }
    }

    public render(): JSX.Element {
        return (
            <div className='product-resources-list'>
                <div className='column'>
                    <div className='dropdown'>{this.renderUnsuedProductsList()}</div>
                    <div className='actions'>
                        <div className='delete-button'>
                            <Button
                                variant='warning'
                                size='sm'
                                onClick={this.handleRemoveProduct}
                                disabled={!this.state.selectedProductInTemplate}
                            >Убрать продукт</Button>
                        </div>
                        <div className='add-button'>
                            <Button
                                variant='success'
                                size='sm'
                                onClick={this.handleAddProduct}
                                disabled={!this.state.selectedProductInDropdown}
                            >Добавить продукт</Button>
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
                                checkboxSelection: true,
                                sort: 'asc'
                            }]}
                            rowData={this.templateStore.productIdsInCurrentTemplate.map(pt => this.productStore.allProducts.find(p => p.rkProductId === pt))}
                            modules={AllCommunityModules}
                            rowSelection='single'
                            onGridSizeChanged={(ev) => ev.api.sizeColumnsToFit()}
                            floatingFilter={true}
                            alwaysShowVerticalScroll={true}
                            onSelectionChanged={this.handleProductRowSelected}
                        >
                        </AgGridReact>
                    </div>
                </div>
                <div className='column'>
                    <div className='dropdown'>{this.renderUnsuedResourcesList()}</div>
                    <div className='actions'>
                        <div className='delete-button'>
                            <Button
                                variant='warning'
                                size='sm'
                                onClick={this.handleRemoveResource}
                                disabled={!this.state.selectedResourceInTemplate}
                            >Убрать ресурс</Button>
                        </div>
                        <div className='add-button'>
                            <Button
                                variant='success'
                                size='sm'
                                onClick={this.handleAddResource}
                                disabled={!this.state.selectedResourceInDropdown}
                            >Добавить ресурс</Button>
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
                                checkboxSelection: true,
                                sort: 'asc'
                            }]}
                            rowData={this.templateStore.resourceIdsInCurrentTemplate.map(pt => this.resourceStore.allResources.find(p => p.rkResourceId === pt))}
                            modules={AllCommunityModules}
                            rowSelection='single'
                            onGridSizeChanged={(ev) => ev.api.sizeColumnsToFit()}
                            floatingFilter={true}
                            alwaysShowVerticalScroll={true}
                            onSelectionChanged={this.handleResourceRowSelected}
                        >
                        </AgGridReact>
                    </div>
                </div>
            </div >
        );
    }

    handleProductInDropdownSelected = (selectedProduct: any) => {
        this.setState({ selectedProductInDropdown: this.productStore.allProducts.find(p => p.rkProductId === selectedProduct.value)! });
    }

    handleAddProduct = () => {
        this.templateStore.addProductToTemplateList(this.state.selectedProductInDropdown!.rkProductId);
        this.setState({ selectedProductInDropdown: null });
    }

    handleRemoveProduct = () => {
        this.templateStore.removeProductFromTemplateList(this.state.selectedProductInTemplate!.rkProductId);
        this.setState({ selectedProductInTemplate: null });
    }

    handleProductRowSelected = (event: SelectionChangedEvent) => {
        let selectedProduct = event.api.getSelectedRows()[0] as Product;
        if (selectedProduct) {
            let productId = (event.api.getSelectedRows()[0] as Product).rkProductId;
            this.setState({ selectedProductInTemplate: this.productStore.allProducts.find(p => p.rkProductId === productId)! })
        } else {
            this.setState({ selectedProductInTemplate: null })
        }
    }

    private renderUnsuedProductsList(): JSX.Element {
        const options = this.productStore.allProducts
            .filter(p => !this.templateStore.productIdsInCurrentTemplate.find(productId => productId === p.rkProductId))
            .map(n => { return { value: n.rkProductId, label: n.name }; })

        return (
            <Select
                options={options}
                onChange={this.handleProductInDropdownSelected}
                value={this.state.selectedProductInDropdown ? {
                    value: this.state.selectedProductInDropdown!.rkProductId,
                    label: this.state.selectedProductInDropdown!.name
                } : null}
            />
        );
    }

    //-------------

    handleResourceInDropdownSelected = (selectedResource: any) => {
        this.setState({ selectedResourceInDropdown: this.resourceStore.allResources.find(p => p.rkResourceId === selectedResource.value)! });
    }

    handleAddResource = () => {
        this.templateStore.addResourceToTemplateList(this.state.selectedResourceInDropdown!.rkResourceId);
        this.setState({ selectedResourceInDropdown: null });
    }

    handleRemoveResource = () => {
        this.templateStore.removeResourceFromTemplateList(this.state.selectedResourceInTemplate!.rkResourceId);
        this.setState({ selectedResourceInTemplate: null });
    }

    handleResourceRowSelected = (event: SelectionChangedEvent) => {
        let selectedResource = event.api.getSelectedRows()[0] as Resource;
        if (selectedResource) {
            let ResourceId = (event.api.getSelectedRows()[0] as Resource).rkResourceId;
            this.setState({ selectedResourceInTemplate: this.resourceStore.allResources.find(p => p.rkResourceId === ResourceId)! })
        } else {
            this.setState({ selectedResourceInTemplate: null })
        }
    }

    private renderUnsuedResourcesList(): JSX.Element {
        const options = this.resourceStore.allResources
            .filter(p => !this.templateStore.resourceIdsInCurrentTemplate.find(resourceId => resourceId === p.rkResourceId))
            .map(n => { return { value: n.rkResourceId, label: n.name }; })

        return (
            <Select
                options={options}
                onChange={this.handleResourceInDropdownSelected}
                value={this.state.selectedResourceInDropdown ? {
                    value: this.state.selectedResourceInDropdown!.rkResourceId,
                    label: this.state.selectedResourceInDropdown!.name
                } : null}
            />
        );
    }
}