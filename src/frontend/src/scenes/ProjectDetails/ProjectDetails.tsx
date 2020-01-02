import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';

import './ProjectDetails.scss';

import { StoresType, ProjectStore, EMPTY_TEMPLATE_ID } from 'stores';
import { routes, makeUrlWithParams } from 'routes';
import { ExperimentStore } from 'stores/Experiment.store';
import { ExperimentShortInfo } from 'models';
import { ExperimentsList } from 'components/ExperimentsList';
import { BelsimLoader } from 'components/BelsimLoader';
import { Button } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class ProjectDetails extends Component<{ stores: StoresType }, { selectedExperiment: ExperimentShortInfo | null }> {
    public routerStore: RouterStore;
    public experimentStore: ExperimentStore;
    public projectStore: ProjectStore;

    constructor(props) {
        super(props);
        this.routerStore = this.props.stores!.RouterStore;
        this.experimentStore = this.props.stores!.ExperimentStore;
        this.projectStore = this.props.stores!.ProjectStore;
    }

    componentDidMount() {
        this.experimentStore.loadProjectExperimentsList(this.projectStore.currenProject.projectId);
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
                {this.experimentStore.isLoading ?
                    (<BelsimLoader />) :
                    (
                        <>
                            <Button
                                onClick={this.handleCreateNewTemplate}
                                variant="success"
                                className='belsim-action-button'
                            >
                                Создать модель данных <FiPlus />
                            </Button>
                            <ExperimentsList
                                title='Все запущенные эксперименты проекта'
                                experiments={this.experimentStore.projectExperimentsList}
                                onOpenResults={this.handleOpenExperimentResults}
                            />
                        </>
                    )}
            </div >
        );
    }
}