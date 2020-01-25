import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';

import './CostsEditor.scss';

import { TemplateStore, StoresType, ProjectStore, ProductStore, ResourceStore } from 'stores';
import { coeffValueParser, currencyValueParser } from 'helpers/gridNumberParser';
import { Form } from 'react-bootstrap';
import { BelsimInput } from 'components/BelsimInput';
import { runInAction } from 'mobx';
import { DistrFuncTypeSelector } from 'components/DistrFuncTypeSelector';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class CostsEditor extends Component<{ stores?: StoresType }> {
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

        this.templateStore.initCostsControlForm();
    }

    componentWillUnmount() {
        this.templateStore.costsControlForm.dispose();
    }

    public render(): JSX.Element {
        return (
            <div className='costs-editor'>
                <div className='editor-blocks'>
                    {this.renderFixedConstsEditor()}
                    {this.renderCstsChangeCoefficientEditor()}
                    {this.renderСostsChangeIntervalEditor()}
                </div>
                <hr />
                {this.renderProductCostsEditor()}
            </div>
        );
    }

    private renderFixedConstsEditor(): JSX.Element {
        return (
            <div className='block-editor'>
                <div className='editor-form'>
                    <Form noValidate>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.costsControlForm.controls.fixedCosts}
                            showErrors={this.templateStore.costsControlForm.controls.fixedCosts.touched}
                            fieldName='Постоянные (руб./мес.):'
                            className='name'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.costsControlForm.controls.wageShare}
                            showErrors={this.templateStore.costsControlForm.controls.wageShare.touched}
                            fieldName='Доля заработной платы в постоянных затратах (отн.ед.):'
                        ></BelsimInput>
                    </Form>
                </div>
            </div>
        );
    }

    private renderCstsChangeCoefficientEditor(): JSX.Element {
        return (
            <div className='block-editor'>
            <div className='title'>Коэффициент изменения затрат</div>
                <div className='editor-form'>
                    <Form noValidate>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.costsControlForm.controls.costsChangeCoefficient}
                            showErrors={this.templateStore.costsControlForm.controls.costsChangeCoefficient.touched}
                            fieldName='Среднее (отн.ед./мес.):'
                            className='name'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.costsControlForm.controls.costsChangeStdDev}
                            showErrors={this.templateStore.costsControlForm.controls.costsChangeStdDev.touched}
                            fieldName='Стандартное отклонение (отн.ед.):'
                        ></BelsimInput>
                        <DistrFuncTypeSelector
                            value={this.templateStore.currentTemplate.costsChangeDistrFuncType}
                            onChange={(val) => runInAction(() => { this.templateStore.currentTemplate.costsChangeDistrFuncType = val; })}
                        />
                    </Form>
                </div>
            </div>
        );
    }

    private renderСostsChangeIntervalEditor(): JSX.Element {
        return (
            <div className='block-editor'>
            <div className='title'>Интервал между изменениями</div>
                <div className='editor-form'>
                    <Form noValidate>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.costsControlForm.controls.costsChangeInterval}
                            showErrors={this.templateStore.costsControlForm.controls.costsChangeInterval.touched}
                            fieldName='Среднее (отн.ед./мес.):'
                            className='name'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.costsControlForm.controls.costsChangeIntervalStdDev}
                            showErrors={this.templateStore.costsControlForm.controls.costsChangeIntervalStdDev.touched}
                            fieldName='Стандартное отклонение (отн.ед.):'
                        ></BelsimInput>
                        <DistrFuncTypeSelector
                            value={this.templateStore.currentTemplate.costsChangeIntervalDistrFuncType}
                            onChange={(val) => runInAction(() => { this.templateStore.currentTemplate.costsChangeIntervalDistrFuncType = val; })}
                        />
                    </Form>
                </div>
            </div>
        );
    }


    private renderProductCostsEditor(): JSX.Element {
        return (
            <div className='resource-store-editor'>
                <div className='title'>Переменные затраты</div>
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
                                    sort: 'asc'
                                },
                                {
                                    headerName: "Прочие переменные (руб./ед.прод.)",
                                    field: "variableCosts",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    editable: true,
                                    valueParser: currencyValueParser
                                },
                                {
                                    headerName: "Доля заработной платы в переменных затратах (отн.ед.)",
                                    field: "wageShare",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    editable: true,
                                    valueParser: coeffValueParser
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

    private productNameFormatter = (params: { value: string }): string => {
        return this.productStore.getProductName(params.value);
    }

}