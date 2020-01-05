import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form } from 'react-bootstrap';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';

import './FinanceEditor.scss';

import { TemplateStore, StoresType } from 'stores';
import { BelsimInput } from 'components/BelsimInput';
import { BelsimCheckbox } from 'components/BmailCheckbox';
import { currencyValueParser } from 'helpers/gridNumberParser';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class FinanceEditor extends Component<{ stores?: StoresType }> {
    public templateStore: TemplateStore;

    constructor(props) {
        super(props);
        this.templateStore = this.props.stores!.TemplateStore;

        this.templateStore.initFinanceControlForm();
    }

    componentWillUnmount() {
        this.templateStore.financeControlForm.dispose();
    }

    public render(): JSX.Element {
        return (
            <div className='finance-editor'>
                <div className='editor-blocks'>
                    {this.renderFinanceEditor()}
                    {this.renderCreditEditor()}
                    {this.renderFixedAssetsEditor()}
                </div>
                <hr />
                {this.renderAccountsEditor()}
            </div>
        );
    }

    private renderFinanceEditor(): JSX.Element {
        return (
            <div className='block-editor'>
                <div className='title'>Общие финансы</div>
                <Form noValidate>
                    <BelsimInput
                        inputType='number'
                        formControl={this.templateStore.financeControlForm.controls.settlementAccountVolume}
                        showErrors={this.templateStore.financeControlForm.controls.settlementAccountVolume.touched}
                        fieldName='Сумма на расчетном счету (руб.):'
                        className='name'
                    ></BelsimInput>
                </Form>
            </div>
        );
    }

    private renderCreditEditor(): JSX.Element {
        return (
            <div className='block-editor'>
                <div className='title'>Кредиты</div>
                <Form noValidate>
                    <BelsimCheckbox
                        formControl={this.templateStore.financeControlForm.controls.isCreditUsed}
                        showErrors={this.templateStore.financeControlForm.controls.isCreditUsed.touched}
                        fieldName='Использование для покрытия нехватки денежных средств'
                        name='useCredit'
                    ></BelsimCheckbox>
                    <BelsimInput
                        inputType='number'
                        formControl={this.templateStore.financeControlForm.controls.interestRate}
                        showErrors={this.templateStore.financeControlForm.controls.interestRate.touched}
                        fieldName='Процентная ставка (отн.ед./год, %):'
                        className='name'
                    ></BelsimInput>
                    <BelsimInput
                        inputType='number'
                        formControl={this.templateStore.financeControlForm.controls.creditInterval}
                        showErrors={this.templateStore.financeControlForm.controls.creditInterval.touched}
                        fieldName='Интервал между обращениями (дн.):'
                        className='name'
                    ></BelsimInput>
                    <BelsimInput
                        inputType='number'
                        formControl={this.templateStore.financeControlForm.controls.creditCycle}
                        showErrors={this.templateStore.financeControlForm.controls.creditCycle.touched}
                        fieldName='Срок (дн.):'
                        className='name'
                    ></BelsimInput>
                    <BelsimInput
                        inputType='number'
                        formControl={this.templateStore.financeControlForm.controls.liquidityRatio}
                        showErrors={this.templateStore.financeControlForm.controls.liquidityRatio.touched}
                        fieldName='Коэффициент покрытия нехватки денежных средств (отн.ед.):'
                        className='name'
                    ></BelsimInput>
                </Form>
            </div>
        );
    }

    private renderFixedAssetsEditor(): JSX.Element {
        return (
            <div className='block-editor'>
                <div className='title'>Основные средства</div>
                <Form noValidate>
                    <BelsimInput
                        inputType='number'
                        formControl={this.templateStore.financeControlForm.controls.replacementCost}
                        showErrors={this.templateStore.financeControlForm.controls.replacementCost.touched}
                        fieldName='Восстановительная стоимость (руб.):'
                        className='name'
                    ></BelsimInput>
                    <BelsimInput
                        inputType='number'
                        formControl={this.templateStore.financeControlForm.controls.wearFactor}
                        showErrors={this.templateStore.financeControlForm.controls.wearFactor.touched}
                        fieldName='Коэффициент износа (отн.ед.):'
                        className='name'
                    ></BelsimInput>
                    <BelsimInput
                        inputType='number'
                        formControl={this.templateStore.financeControlForm.controls.amortizationQuota}
                        showErrors={this.templateStore.financeControlForm.controls.amortizationQuota.touched}
                        fieldName='Норма амортизации (отн.ед./год):'
                        className='name'
                    ></BelsimInput>
                    <BelsimInput
                        inputType='number'
                        formControl={this.templateStore.financeControlForm.controls.overvalueCoefficient}
                        showErrors={this.templateStore.financeControlForm.controls.overvalueCoefficient.touched}
                        fieldName='Коэффициент переоценки (отн.ед./год):'
                        className='name'
                    ></BelsimInput>
                </Form>
            </div>
        );
    }

    private renderAccountsEditor(): JSX.Element {
        return (
            <div className='accounts-editor'>
                <div className='title'>Счета</div>
                <div className='ag-theme-balham'>
                    <AgGridReact
                        columnDefs={
                            [
                                {
                                    headerName: "Наименование счета",
                                    field: "name",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    sort: 'asc'
                                },
                                {
                                    headerName: "Начальное значение",
                                    field: "value",
                                    sortable: true,
                                    filter: true,
                                    suppressMovable: true,
                                    editable: true,
                                    valueParser: currencyValueParser
                                }
                            ]
                        }
                        rowData={this.templateStore.currentTemplate.accounts}
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
}