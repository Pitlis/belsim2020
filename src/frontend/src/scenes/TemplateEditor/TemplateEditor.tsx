import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import './TemplateEditor.scss';

import { ProjectStore, RouterStore, TemplateStore, StoresType } from 'stores';
import { getTemplateIdFromUrl } from 'routes/getIdFromUrl';
import { CommonInfoEditor } from './CommonInfoEditor/CommonInfoEditor';
import { BelsimLoader } from 'components/BelsimLoader';
import { Card, Button } from 'react-bootstrap';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class TemplateEditor extends Component<{ stores?: StoresType }, { activeEditFormName: string }> {
    public projectStore: ProjectStore;
    public routerStore: RouterStore;
    public templateStore: TemplateStore;

    constructor(props) {
        super(props);
        this.projectStore = this.props.stores!.ProjectStore;
        this.routerStore = this.props.stores!.RouterStore;
        this.templateStore = this.props.stores!.TemplateStore;

        this.state = {
            activeEditFormName: EditFormsName.COMMON_INFO,
        }
    }

    componentDidMount() {
        let templateId = getTemplateIdFromUrl(this.routerStore.location);
        this.templateStore.openTemplate(templateId);
    }

    handleCreateTemplate = () => {
        this.templateStore.createTemplate(this.projectStore.currenProject.projectId);
    }

    public render(): JSX.Element {
        return (
            <div className='template-editor'>
                {this.templateStore.isLoading
                    ? <BelsimLoader />
                    : this.renderEditForm()
                }
            </div>
        );
    }

    private renderEditForm() {
        return (
            <>
                {this.templateStore.isTemplateEmpty
                    ? this.renderTemplateCreating()
                    : this.renderTemplateSaving()}
                <div className='edit-form'>
                    <Card border='info' className='editor'>
                        <Card.Body>
                            <Card.Title>{this.state.activeEditFormName}</Card.Title>
                            {this.renderEditComponent()}
                        </Card.Body>
                    </Card>
                </div>
            </>
        );
    }

    private renderEditComponent() {
        switch (this.state.activeEditFormName) {
            case EditFormsName.COMMON_INFO:
                return <CommonInfoEditor />
            default:
                return null;
        }
    }

    private renderTemplateSaving() {
        return (
            <div className='template-saving'>
            </div>
        );
    }



    private renderTemplateCreating() {
        return (
            <div className='template-saving'>
                <Button
                    disabled={!this.templateStore.isTemplateValid}
                    onClick={this.handleCreateTemplate}
                    variant="success"
                    className='belsim-action-button'
                >
                    Создать
                </Button>
            </div>
        );
    }
}

enum EditFormsName {
    COMMON_INFO = 'Общая информация'
}