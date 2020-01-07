import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';

import './ProjectDetails.scss';

import { StoresType, ProjectStore, EMPTY_TEMPLATE_ID, TemplateStore } from 'stores';
import { routes, makeUrlWithParams } from 'routes';
import { ExperimentShortInfo } from 'models';
import { BelsimLoader } from 'components/BelsimLoader';
import { Button } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import { TemplateCard } from 'components/TemplateCard';
import { when } from 'mobx';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class ProjectDetails extends Component<{ stores: StoresType }, { isLoading: boolean }> {
    public routerStore: RouterStore;
    public projectStore: ProjectStore;
    public templateStore: TemplateStore;

    constructor(props) {
        super(props);
        this.routerStore = this.props.stores!.RouterStore;
        this.projectStore = this.props.stores!.ProjectStore;
        this.templateStore = this.props.stores!.TemplateStore;

        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        this.templateStore.loadProjectTemplatesList(this.projectStore.currenProject.projectId);

        when(
            () => !!this.templateStore.templatesInProject && !this.templateStore.isLoading && !this.projectStore.isLoading,
            () => this.setState({ isLoading: false })
        );
    }

    handleOpenExperimentResults = (experiment: ExperimentShortInfo) => {
        this.routerStore.push(makeUrlWithParams(routes.experimentResults.path,
            {
                experimentId: experiment.experimentId,
                projectId: this.projectStore.currenProject.projectId
            }
        ));
    }

    handleCreateNewTemplate = () => {
        this.routerStore.push(makeUrlWithParams(routes.template.path, {
            projectId: this.projectStore.currenProject.projectId,
            templateId: EMPTY_TEMPLATE_ID
        }));
    }

    public render(): JSX.Element {
        return (
            <div className='project-details'>
                {this.templateStore.isLoading || this.templateStore.templatesInProject === undefined ?
                    (<BelsimLoader />) :
                    (
                        <>
                            <div className='actions'>
                                <Button
                                    onClick={this.handleCreateNewTemplate}
                                    variant="success"
                                    className='belsim-action-button'
                                >
                                    Создать модель данных <FiPlus />
                                </Button>
                            </div>
                            {this.renderTemplatesList()}
                        </>
                    )}
            </div >
        );
    }

    handleOpenTemplate = (templateId: string) => {
        this.routerStore.push(makeUrlWithParams(routes.template.path,
            {
                templateId,
                projectId: this.projectStore.currenProject.projectId
            }
        ));
    }

    public renderTemplatesList(): JSX.Element {
        return (
            <div className='templates-list'>
                {this.templateStore.templatesInProject.map((t) =>
                    <TemplateCard
                        key={t.rkExperimentTemplateId}
                        template={t}
                        onOpenTemplate={this.handleOpenTemplate}
                    />
                )}
            </div>
        );
    }
}