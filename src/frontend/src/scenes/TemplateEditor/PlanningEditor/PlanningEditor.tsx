import React, { Component } from 'react';
import { inject, observer } from 'mobx-react'; import { AgGridReact } from '@ag-grid-community/react';
import { SelectionChangedEvent } from "@ag-grid-community/core";
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import Select from 'react-select'

import './PlanningEditor.scss';

import { TemplateStore, StoresType, ProjectStore, ProductStore, ResourceStore } from 'stores';
import { BelsimInput } from 'components/BelsimInput';
import { Form, Button } from 'react-bootstrap';
import { ExperimentProduct, ExperimentResource, ExperimentResourceInProduct } from 'models';
import { wholeNumberValueParser } from 'helpers/gridNumberParser';

interface IState {
    selectedProduct: ExperimentProduct | null;
    selectedResourceInDropdown: ExperimentResource | null;
}

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class PlanningEditorEditor extends Component<{ stores?: StoresType }, IState> {
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
            selectedProduct: null,
            selectedResourceInDropdown: null
        }

        this.templateStore.initPlanningControlForm();
    }

    componentWillUnmount() {
        this.templateStore.planningControlForm.dispose();
    }

    public render(): JSX.Element {
        return (
            <div className='planning-editor'>
                {this.renderForm()}
                {this.renderProductCycleEditor()}
                {this.renderProductResourcesEditor()}
            </div>
        );
    }

    private renderForm(): JSX.Element {
        return (
            <div className='editor-form'>
                <Form noValidate>
                    <BelsimInput
                        inputType='number'
                        formControl={this.templateStore.planningControlForm.controls.planningInterval}
                        showErrors={this.templateStore.planningControlForm.controls.planningInterval.touched}
                        fieldName='Интервал планирования (дн.):'
                        className='name'
                    ></BelsimInput>
                    <BelsimInput
                        inputType='number'
                        formControl={this.templateStore.planningControlForm.controls.planningIntervalsCount}
                        showErrors={this.templateStore.planningControlForm.controls.planningIntervalsCount.touched}
                        fieldName='Количество интервалов планирования (ед.):'
                    ></BelsimInput>
                </Form>
            </div>
        );
    }

    handleProductRowSelected = (event: SelectionChangedEvent) => {
        let selectedProduct = event.api.getSelectedRows()[0] as ExperimentProduct;
        console.log('selectedProduct');
        console.log(selectedProduct);
        if (selectedProduct) {
            this.setState({ selectedProduct: selectedProduct, selectedResourceInDropdown: null })
        } else {
            this.setState({ selectedProduct: null, selectedResourceInDropdown: null });
        }
    }

    private renderProductCycleEditor(): JSX.Element {
        return (
            <div className='cycle-editor'>
                <div className='title'>Производственный цикл</div>
                <div className='ag-theme-balham'>
                    <AgGridReact
                        columnDefs={[{
                            headerName: "Наименование продукта",
                            field: "productId",
                            sortable: true,
                            filter: true,
                            suppressMovable: true,
                            valueFormatter: this.productNameFormatter,
                            checkboxSelection: true
                        },
                        {
                            headerName: "Длительность цикла (дн.)",
                            field: "cycleTime",
                            suppressMovable: true,
                            editable: true,
                            valueParser: wholeNumberValueParser
                        }]}
                        rowData={this.templateStore.currentTemplate.products}
                        modules={AllCommunityModules}
                        rowSelection='single'
                        onGridSizeChanged={(ev) => ev.api.sizeColumnsToFit()}
                        floatingFilter={true}
                        alwaysShowVerticalScroll={true}
                        onSelectionChanged={this.handleProductRowSelected}
                    >
                    </AgGridReact>
                </div>
            </div >
        );
    }

    private renderProductResourcesEditor(): JSX.Element {
        return (
            <div className='resources-editor'>
                <div className='title'>Расход ресурсов на производство</div>
                {this.renderProductResourcesActions()}
                <div className='ag-theme-balham'>
                    <AgGridReact
                        columnDefs={[{
                            headerName: "Наименование ресурса",
                            field: "rkResourceInExperimentId",
                            sortable: true,
                            filter: true,
                            suppressMovable: true,
                            valueFormatter: this.resourceNameFormatter
                        },
                        {
                            headerName: "Расход ресурсов (ед.рес./ед.прод.)",
                            field: "resourceConsumption",
                            suppressMovable: true,
                            editable: true,
                            valueParser: wholeNumberValueParser,
                            valueSetter: this.resourceConsumationSetter
                        }]}
                        rowData={this.state.selectedProduct ? this.state.selectedProduct.resources : []}
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

    handleAddResourceToProduct = () => {
        this.templateStore.addResourceToProduct(
            this.state.selectedProduct!.rkProductInExperimentId,
            this.state.selectedResourceInDropdown!.rkResourceInExperimentId
        );
        let selectedProduct = this.state.selectedProduct;

        //remove and add selectedProduct in state - to fix problem with no updating grid after added new element
        this.setState({ selectedResourceInDropdown: null, selectedProduct: null },
            () => { this.setState({ selectedProduct: selectedProduct }) });
    }

    private renderProductResourcesActions(): JSX.Element {
        return (
            <div className='actions'>
                <div className='selector'>{this.renderUnsuedResourcesList()}</div>
                <div className='add-resource'>
                    <Button
                        variant='success'
                        size='sm'
                        onClick={this.handleAddResourceToProduct}
                        disabled={!this.state.selectedResourceInDropdown}
                    >Добавить ресурс</Button>
                </div>
            </div>
        );
    }

    handleResourceInDropdownSelected = (selectedResource: any) => {
        this.setState({ selectedResourceInDropdown: this.templateStore.currentTemplate.resources.find(p => p.rkResourceInExperimentId === selectedResource.value)! });
    }

    private renderUnsuedResourcesList(): JSX.Element {
        let options: any = [];

        if (!!this.state.selectedProduct) {
            options = this.templateStore.currentTemplate.resources
                .filter(r => !this.state.selectedProduct!.resources.find(pr => r.rkResourceInExperimentId === pr.rkResourceInExperimentId))
                .map(n => { return { value: n.rkResourceInExperimentId, label: this.resourceStore.getResourceName(n.resourceId) } });
        }

        return (
            <Select
                options={options}
                onChange={this.handleResourceInDropdownSelected}
                isDisabled={!this.state.selectedProduct}
                value={this.state.selectedResourceInDropdown ? {
                    value: this.state.selectedResourceInDropdown!.rkResourceInExperimentId,
                    label: this.resourceStore.getResourceName(this.state.selectedResourceInDropdown!.resourceId)
                } : null}
            />
        );
    }

    private productNameFormatter = (params: { value: string }): string => {
        return this.productStore.getProductName(params.value);
    }

    private resourceNameFormatter = (params: { value: string }): string => {
        let rkResourceInExperimentId = params.value;
        let resourceInExperiment = this.templateStore.currentTemplate.resources.find(r => r.rkResourceInExperimentId === rkResourceInExperimentId);
        return this.resourceStore.getResourceName(resourceInExperiment!.resourceId);
    }

    private resourceConsumationSetter = (params: { newValue: string, oldValue: string, data: ExperimentResourceInProduct }): boolean => {

        this.templateStore.changeResourceConsumation(
            this.state.selectedProduct!.rkProductInExperimentId,
            params.data.rkResourceInExperimentId,
            Number(params.newValue))

        return true;
    }
}