import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import './CommonInfoEditor.scss';

import { TemplateStore, StoresType, ProjectStore } from 'stores';
import { BelsimInput } from 'components/BelsimInput';
import { Form } from 'react-bootstrap';
import { formatDate } from 'helpers/dateFormatter';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class CommonInfoEditor extends Component<{ stores?: StoresType }> {
    public templateStore: TemplateStore;
    public projectStore: ProjectStore;

    constructor(props) {
        super(props);
        this.templateStore = this.props.stores!.TemplateStore;
        this.projectStore = this.props.stores!.ProjectStore;

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
                {this.templateStore.isTemplateEmpty ? null : this.renderAdditionalInfo()}
            </div>
        );
    }

    private renderAdditionalInfo(): JSX.Element {
        let owner = this.projectStore.currenProject.assignedUsers.find(u => u.userId === this.templateStore.currentTemplate.ownerId);
        return (
            <div className='additional-info'>
                <div className='additional-info-row'>
                    <span className='title'>Создан: </span> {formatDate(this.templateStore.currentTemplate.createdAt)}
                </div>
                <div className='additional-info-row'>
                    <span className='title'>Изменен: </span> {formatDate(this.templateStore.currentTemplate.modifiedAt)}
                </div>
                <div className='additional-info-row'>
                    <span className='title'>Автор: </span> {owner ? owner.name : '[удален]'}
                </div>
                <div className='additional-info-row'>
                    <span className='title'>ID: </span> {this.templateStore.currentTemplate.rkExperimentTemplateId}
                </div>
            </div>
        );
    }
}