import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';

import './StoreEditor.scss';

import { TemplateStore, StoresType, ProjectStore, ProductStore, ResourceStore } from 'stores';
import { wholeNumberValueParser, currencyValueParser } from 'helpers/gridNumberParser';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class StoreEditor extends Component<{ stores?: StoresType }> {
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
    }

    public render(): JSX.Element {
        return (
            <div className='store-editor'>
                {this.renderProductStoreEditor()}
                <hr />
                {this.renderResourceStoreEditor()}
            </div>
        );
    }

    private renderProductStoreEditor(): JSX.Element {
        return (
            <div className='product-store-editor'>
                <div className='title'>Готовая продукция</div>
                <div className='ag-theme-balham'>
                    <AgGridReact
                        columnDefs={
                            [
                                {
                                    headerName: "Наименование продукта",
                                    field: "productId",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    valueFormatter: this.productNameFormatter,
                                },
                                {
                                    headerName: "Запасы (ед.)",
                                    field: "finishedProductCount",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    editable: true,
                                    valueParser: wholeNumberValueParser
                                },
                                {
                                    headerName: "Себестоимость (руб./ед.)",
                                    field: "finishedProductCost",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    editable: true,
                                    valueParser: currencyValueParser
                                }
                            ]
                        }
                        rowData={this.templateStore.currentTemplate.products}
                        modules={AllCommunityModules}
                        onGridSizeChanged={(ev) => ev.api.sizeColumnsToFit()}
                        floatingFilter={true}
                        alwaysShowVerticalScroll={true}
                    >
                    </AgGridReact>
                </div>
            </div>
        );
    }

    private renderResourceStoreEditor(): JSX.Element {
        return (
            <div className='resource-store-editor'>
                <div className='title'>Материальные ресурсы на складе</div>
                <div className='ag-theme-balham'>
                    <AgGridReact
                        columnDefs={
                            [
                                {
                                    headerName: "Наименование ресурса",
                                    field: "resourceId",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    valueFormatter: this.resourceNameFormatter,
                                },
                                {
                                    headerName: "Запасы (ед.)",
                                    field: "storedResourcesCount",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    editable: true,
                                    valueParser: wholeNumberValueParser
                                },
                                {
                                    headerName: "Цена ресурса на складе (руб./ед.)",
                                    field: "storedResourcePrice",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    editable: true,
                                    valueParser: currencyValueParser
                                }
                            ]
                        }
                        rowData={this.templateStore.currentTemplate.resources}
                        modules={AllCommunityModules}
                        onGridSizeChanged={(ev) => ev.api.sizeColumnsToFit()}
                        floatingFilter={true}
                        alwaysShowVerticalScroll={true}
                    >
                    </AgGridReact>
                </div>
            </div>
        );
    }

    private productNameFormatter = (params: { value: string }): string => {
        return this.productStore.getProductName(params.value);
    }

    private resourceNameFormatter = (params: { value: string }): string => {
        return this.resourceStore.getResourceName(params.value);
    }
}