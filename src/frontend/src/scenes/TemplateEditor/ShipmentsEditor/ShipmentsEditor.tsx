import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules, ICellRendererParams, SelectionChangedEvent } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import { Form, Button } from 'react-bootstrap';
import { runInAction } from 'mobx';

import './ShipmentsEditor.scss';

import { TemplateStore, StoresType, ProductStore } from 'stores';
import { BelsimInput } from 'components/BelsimInput';
import { DistrFuncTypeSelector } from 'components/DistrFuncTypeSelector';
import { wholeNumberValueParser, currencyValueParser } from 'helpers/gridNumberParser';
import { DistrFuncTypes, ExperimentProduct } from 'models';

interface IState {
    selectedProduct: ExperimentProduct | null;
}

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class ShipmentsEditor extends Component<{ stores?: StoresType }, IState> {
    public templateStore: TemplateStore;
    public productStore: ProductStore;

    constructor(props) {
        super(props);
        this.templateStore = this.props.stores!.TemplateStore;
        this.productStore = this.props.stores!.ProductStore;

        this.state = {
            selectedProduct: null
        };

        this.templateStore.initShipmentControlForm();
    }

    componentWillUnmount() {
        this.templateStore.shipmentControlForm.dispose();
    }

    public render(): JSX.Element {
        return (
            <div className='shipments-editor'>
                <div className='editor-blocks'>
                    {this.renderShipmentIntervalEditor()}
                    {this.renderPaymentDateEditor()}
                    {this.renderPriceChangeCoefficientEditor()}
                    {this.renderPriceChangeIntervalEditor()}
                </div>
                <hr />
                {this.renderProductsShipmentEditor()}
                <hr />
                {this.renderShipmentsEditor()}
            </div>
        );
    }

    private renderShipmentIntervalEditor(): JSX.Element {
        return (
            <div className='block-editor'>
                <div className='title'>Интервал между отгрузками</div>
                <div className='editor-form'>
                    <Form noValidate>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.shipmentControlForm.controls.shippingCycle}
                            showErrors={this.templateStore.shipmentControlForm.controls.shippingCycle.touched}
                            fieldName='Среднее (дн.):'
                            className='name'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.shipmentControlForm.controls.shippingCycleStdDev}
                            showErrors={this.templateStore.shipmentControlForm.controls.shippingCycleStdDev.touched}
                            fieldName='Стандартное отклонение (дн.):'
                        ></BelsimInput>
                        <DistrFuncTypeSelector
                            value={this.templateStore.currentTemplate.shippingCycleDistrFuncType}
                            onChange={(val) => runInAction(() => { this.templateStore.currentTemplate.shippingCycleDistrFuncType = val; })}
                        />
                    </Form>
                </div>
            </div>
        );
    }

    private renderPaymentDateEditor(): JSX.Element {
        return (
            <div className='block-editor'>
                <div className='title'>Срок платежа</div>
                <div className='editor-form'>
                    <Form noValidate>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.shipmentControlForm.controls.paymentDate}
                            showErrors={this.templateStore.shipmentControlForm.controls.paymentDate.touched}
                            fieldName='Среднее (дн.):'
                            className='name'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.shipmentControlForm.controls.paymentDateStdDev}
                            showErrors={this.templateStore.shipmentControlForm.controls.paymentDateStdDev.touched}
                            fieldName='Стандартное отклонение (дн.):'
                        ></BelsimInput>
                        <DistrFuncTypeSelector
                            value={this.templateStore.currentTemplate.paymentDateDistrFuncType}
                            onChange={(val) => runInAction(() => { this.templateStore.currentTemplate.paymentDateDistrFuncType = val; })}
                        />
                    </Form>
                </div>
            </div>
        );
    }

    private renderPriceChangeCoefficientEditor(): JSX.Element {
        return (
            <div className='block-editor'>
                <div className='title'>Коэффициент изменения цен</div>
                <div className='editor-form'>
                    <Form noValidate>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.shipmentControlForm.controls.priceChangeCoefficient}
                            showErrors={this.templateStore.shipmentControlForm.controls.priceChangeCoefficient.touched}
                            fieldName='Среднее (дн.):'
                            className='name'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.shipmentControlForm.controls.priceChangeCoefficientStdDev}
                            showErrors={this.templateStore.shipmentControlForm.controls.priceChangeCoefficientStdDev.touched}
                            fieldName='Стандартное отклонение (дн.):'
                        ></BelsimInput>
                        <DistrFuncTypeSelector
                            value={this.templateStore.currentTemplate.priceChangeCoefficientDistrFuncType}
                            onChange={(val) => runInAction(() => { this.templateStore.currentTemplate.priceChangeCoefficientDistrFuncType = val; })}
                        />
                    </Form>
                </div>
            </div>
        );
    }

    private renderPriceChangeIntervalEditor(): JSX.Element {
        return (
            <div className='block-editor'>
                <div className='title'>Интервал между изменениями цен</div>
                <div className='editor-form'>
                    <Form noValidate>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.shipmentControlForm.controls.priceChangeInterval}
                            showErrors={this.templateStore.shipmentControlForm.controls.priceChangeInterval.touched}
                            fieldName='Среднее (дн.):'
                            className='name'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.shipmentControlForm.controls.priceChangeIntervalStdDev}
                            showErrors={this.templateStore.shipmentControlForm.controls.priceChangeIntervalStdDev.touched}
                            fieldName='Стандартное отклонение (дн.):'
                        ></BelsimInput>
                        <DistrFuncTypeSelector
                            value={this.templateStore.currentTemplate.priceChangeIntervalDistrFuncType}
                            onChange={(val) => runInAction(() => { this.templateStore.currentTemplate.priceChangeIntervalDistrFuncType = val; })}
                        />
                    </Form>
                </div>
            </div>
        );
    }

    handleProductRowSelected = (event: SelectionChangedEvent) => {
        let selectedProduct = event.api.getSelectedRows()[0] as ExperimentProduct;
        if (selectedProduct) {
            this.setState({ selectedProduct: selectedProduct })
        } else {
            this.setState({ selectedProduct: null });
        }
    }

    private renderProductsShipmentEditor(): JSX.Element {
        return (
            <div className='products-shipment-editor'>
                <div className='title'>Объем отгрузки и стоимость продукции</div>
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
                                    checkboxSelection: true,
                                    sort: 'asc'
                                },
                                {
                                    headerName: "[Объем отгрузки] Среднее (ед.)",
                                    field: "shipmentVolume",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    editable: true,
                                    valueParser: wholeNumberValueParser
                                },
                                {
                                    headerName: "[Объем отгрузки] Стандартное отклонение (ед.)",
                                    field: "shipmentVolumeStdDev",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    editable: true,
                                    valueParser: wholeNumberValueParser
                                },
                                {
                                    headerName: "[Объем отгрузки] Вид функции плотности распределения",
                                    field: "shipmentVolumeDistrFuncType",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    editable: true,
                                    cellRendererFramework: this.renderDistrFuncSelector
                                },
                                {
                                    headerName: "Цена продукции (руб./ед.)",
                                    field: "price",
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
                        rowSelection='single'
                        alwaysShowVerticalScroll={true}
                        headerHeight={50}
                        onSelectionChanged={this.handleProductRowSelected}
                    >
                    </AgGridReact>
                </div>
            </div>
        );
    }

    private productNameFormatter = (params: { value: string }): string => {
        return this.productStore.getProductName(params.value);
    }

    private renderDistrFuncSelector = (event: ICellRendererParams) => {
        return (
            <select
                value={event.value}
                onChange={v => { event.setValue(Number(v.target.value)) }}
                className='distr-func-selector'
            >
                <option value={DistrFuncTypes.Uniform}>Равномерное</option>
                <option value={DistrFuncTypes.Exponential}>Показательное</option>
                <option value={DistrFuncTypes.Normal}>Нормальное</option>
            </select>
        );
    }

    handleRemoveShipment = () => {
        this.templateStore.removeLastProductsShipment();
    }

    handleAddShipment = () => {
        this.templateStore.addProductsShipment();

        //remove and add selectedProduct in state - to fix problem with no updating grid after added new element
        let selectedProduct = this.state.selectedProduct;
        this.setState({ selectedProduct: null },
            () => { this.setState({ selectedProduct: selectedProduct }) });
    }

    private renderShipmentsEditor(): JSX.Element {
        return (
            <div className='products-shipment-editor'>
                <div className='title'>Задать отгрузки вручную</div>
                <div className='actions'>
                    <Button
                        variant='warning'
                        size='sm'
                        onClick={this.handleRemoveShipment}
                        disabled={
                            !this.state.selectedProduct
                            || this.templateStore.currentTemplate.products.length === 0
                            || (this.templateStore.currentTemplate.products && this.templateStore.currentTemplate.products[0].shipments.length === 0)
                        }
                    >Удалить отгрузку</Button>
                    <Button
                        variant='success'
                        size='sm'
                        onClick={this.handleAddShipment}
                        disabled={!this.state.selectedProduct}
                    >Добавить отгрузку</Button>
                </div>
                <div className='ag-theme-balham'>
                    <AgGridReact
                        columnDefs={
                            [
                                {
                                    headerName: "Месяц",
                                    field: "shipmentDatetime",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    sort: 'asc',
                                    valueFormatter: this.monthFormatter
                                },
                                {
                                    headerName: "Объем продукции в отгрузке (ед.)",
                                    field: "volume",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    editable: true,
                                    valueParser: wholeNumberValueParser
                                }
                            ]
                        }
                        rowData={this.state.selectedProduct ? this.state.selectedProduct.shipments : []}
                        modules={AllCommunityModules}
                        onGridSizeChanged={(ev) => ev.api.sizeColumnsToFit()}
                        floatingFilter={true}
                        alwaysShowVerticalScroll={true}
                    >
                    </AgGridReact>
                </div>
            </div >
        );
    }

    private monthFormatter = (params: { value: number }): string => {
        return (Number(params.value) + 1).toString();
    }
}