import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';

import './SupplyEditor.scss';

import { TemplateStore, StoresType, ProjectStore, ProductStore, ResourceStore } from 'stores';
import { currencyValueParser } from 'helpers/gridNumberParser';
import { Form } from 'react-bootstrap';
import { BelsimInput } from 'components/BelsimInput';
import { runInAction } from 'mobx';
import { DistrFuncTypeSelector } from 'components/DistrFuncTypeSelector';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class SupplyEditor extends Component<{ stores?: StoresType }> {
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

        this.templateStore.initSupplyControlForm();
    }

    componentWillUnmount() {
        this.templateStore.supplyControlForm.dispose();
    }

    public render(): JSX.Element {
        return (
            <div className='supply-editor'>
                <div className='editor-blocks'>
                    {this.renderPaymentEditor()}
                    {this.renderPriceChangeIntervalEditor()}
                    {this.renderPriceChangeCoefficientEditor()}
                </div>
                <hr />
                {this.renderResourcePriceEditor()}
            </div>
        );
    }

    private renderPaymentEditor(): JSX.Element {
        return (
            <div className='block-editor'>
                <div className='title'>Срок платежа</div>
                <div className='editor-form'>
                    <Form noValidate>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.supplyControlForm.controls.supplyPaymentDate}
                            showErrors={this.templateStore.supplyControlForm.controls.supplyPaymentDate.touched}
                            fieldName='Среднее (дн.):'
                            className='name'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.supplyControlForm.controls.supplyPaymentDateStdDev}
                            showErrors={this.templateStore.supplyControlForm.controls.supplyPaymentDateStdDev.touched}
                            fieldName='Стандартное отклонение (ед.):'
                        ></BelsimInput>
                        <DistrFuncTypeSelector
                            value={this.templateStore.currentTemplate.supplyPaymentDateDistrFuncType}
                            onChange={(val) => runInAction(() => { this.templateStore.currentTemplate.supplyPaymentDateDistrFuncType = val; })}
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
                            formControl={this.templateStore.supplyControlForm.controls.supplyPriceChangeInterval}
                            showErrors={this.templateStore.supplyControlForm.controls.supplyPriceChangeInterval.touched}
                            fieldName='Среднее (дн.):'
                            className='name'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.supplyControlForm.controls.supplyPriceChangeIntervalStdDev}
                            showErrors={this.templateStore.supplyControlForm.controls.supplyPriceChangeIntervalStdDev.touched}
                            fieldName='Стандартное отклонение (ед.):'
                        ></BelsimInput>
                        <DistrFuncTypeSelector
                            value={this.templateStore.currentTemplate.supplyPriceChangeIntervalDistrFuncType}
                            onChange={(val) => runInAction(() => { this.templateStore.currentTemplate.supplyPriceChangeIntervalDistrFuncType = val; })}
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
                            formControl={this.templateStore.supplyControlForm.controls.supplyPriceChangeCoefficient}
                            showErrors={this.templateStore.supplyControlForm.controls.supplyPriceChangeCoefficient.touched}
                            fieldName='Среднее (отн.ед./мес.):'
                            className='name'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.supplyControlForm.controls.supplyPriceChangeCoefficientStdDev}
                            showErrors={this.templateStore.supplyControlForm.controls.supplyPriceChangeCoefficientStdDev.touched}
                            fieldName='Стандартное отклонение (отн.ед.):'
                        ></BelsimInput>
                        <DistrFuncTypeSelector
                            value={this.templateStore.currentTemplate.supplyPriceChangeCoefficientDistrFuncType}
                            onChange={(val) => runInAction(() => { this.templateStore.currentTemplate.supplyPriceChangeCoefficientDistrFuncType = val; })}
                        />
                    </Form>
                </div>
            </div>
        );
    }

    private renderResourcePriceEditor(): JSX.Element {
        return (
            <div className='resource-store-editor'>
                <div className='title'>Стоимость ресурсов</div>
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
                                    headerName: "Цена (руб./ед.)",
                                    field: "price",
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

    private resourceNameFormatter = (params: { value: string }): string => {
        return this.resourceStore.getResourceName(params.value);
    }
}