import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import './CommonInfoEditor.scss';

import { TemplateStore, StoresType, ProjectStore, RouterStore } from 'stores';
import { BelsimInput } from 'components/BelsimInput';
import { Form } from 'react-bootstrap';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class CommonInfoEditor extends Component<{ stores?: StoresType }> {
    public templateStore: TemplateStore;
    public projectStore: ProjectStore;
    public routerStore: RouterStore;

    constructor(props) {
        super(props);
        this.templateStore = this.props.stores!.TemplateStore;
        this.projectStore = this.props.stores!.ProjectStore;
        this.routerStore = this.props.stores!.RouterStore;

        this.templateStore.initCommonInfoControlForm();
    }

    componentWillUnmount() {
        this.templateStore.сommonInfoControlForm.dispose();
    }

    public render(): JSX.Element {
        return (
            <div className='common-info-editor'>
                <Form noValidate>
                    <BelsimInput
                        inputType='text'
                        formControl={this.templateStore.сommonInfoControlForm.controls.name}
                        showErrors={this.templateStore.сommonInfoControlForm.controls.name.touched}
                        fieldName='Название шаблона:'
                        className='name'
                    ></BelsimInput>
                    <BelsimInput
                        inputType='text'
                        formControl={this.templateStore.сommonInfoControlForm.controls.description}
                        showErrors={this.templateStore.сommonInfoControlForm.touched}
                        fieldName='Описание:'
                    ></BelsimInput>
                </Form>
                <div className='common-info'>
                    
                </div>
            </div>
        );
    }
}