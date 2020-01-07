import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import './TaxesEditor.scss';

import { TemplateStore, StoresType } from 'stores';
import { BelsimInput } from 'components/BelsimInput';
import { Form } from 'react-bootstrap';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class TaxesEditor extends Component<{ stores?: StoresType }> {
    public templateStore: TemplateStore;

    constructor(props) {
        super(props);
        this.templateStore = this.props.stores!.TemplateStore;

        this.templateStore.initTaxesControlForm();
    }

    componentWillUnmount() {
        this.templateStore.taxesControlForm.dispose();
    }

    public render(): JSX.Element {
        return (
            <div className='taxes-editor'>
                <div className='column'>
                    <Form noValidate>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.taxesControlForm.controls.vat}
                            showErrors={this.templateStore.taxesControlForm.controls.vat.touched}
                            fieldName='НДС (%):'
                            className='name'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.taxesControlForm.controls.earningsTax}
                            showErrors={this.templateStore.taxesControlForm.controls.earningsTax.touched}
                            fieldName='С выручки (%):'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.taxesControlForm.controls.profitsTax}
                            showErrors={this.templateStore.taxesControlForm.controls.profitsTax.touched}
                            fieldName='С прибыли (%):'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.taxesControlForm.controls.restProfitsTax}
                            showErrors={this.templateStore.taxesControlForm.controls.restProfitsTax.touched}
                            fieldName='С прибыли, остающейся в распоряжении предпрития (%):'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.taxesControlForm.controls.fundTax}
                            showErrors={this.templateStore.taxesControlForm.controls.fundTax.touched}
                            fieldName='В фонд социальной защиты (%):'
                        ></BelsimInput>
                    </Form>
                </div>
                <div className='column'>
                    <Form noValidate>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.taxesControlForm.controls.wageTax}
                            showErrors={this.templateStore.taxesControlForm.controls.wageTax.touched}
                            fieldName='С заработной платы (%):'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.taxesControlForm.controls.realEstateTax}
                            showErrors={this.templateStore.taxesControlForm.controls.realEstateTax.touched}
                            fieldName='На недвижимость (%/год):'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.taxesControlForm.controls.landTax}
                            showErrors={this.templateStore.taxesControlForm.controls.ecologicalTax.touched}
                            fieldName='Экологический (руб./ед.прод.):'
                        ></BelsimInput>
                        <BelsimInput
                            inputType='number'
                            formControl={this.templateStore.taxesControlForm.controls.landTax}
                            showErrors={this.templateStore.taxesControlForm.controls.landTax.touched}
                            fieldName='На землю (руб./мес.):'
                        ></BelsimInput>
                    </Form>
                </div>

            </div>
        );
    }
}