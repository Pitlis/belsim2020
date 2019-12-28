import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';

import './ProjectDetails.scss';

import { getProjectIdFromUrl } from 'routes/getIdFromUrl';
import { StoresType } from 'stores';
import { routes, makeUrlWithParams } from 'routes';
import { ExperimentStore } from 'stores/Experiment.store';
import { ExperimentShortInfo } from 'models';
import { ExperimentsList } from 'components/ExperimentsList';
import { BelsimLoader } from 'components/BelsimLoader';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class ProjectDetails extends Component<{ stores: StoresType }, { selectedExperiment: ExperimentShortInfo | null }> {
    public routerStore: RouterStore;
    public experimentStore: ExperimentStore;

    constructor(props) {
        super(props);
        this.routerStore = this.props.stores!.RouterStore;
        this.experimentStore = this.props.stores!.ExperimentStore;
    }

    componentDidMount() {
        let projectId = getProjectIdFromUrl(this.routerStore.location);
        this.experimentStore.loadProjectExperimentsList(projectId);
    }

    handleOpenExperimentResults = (experiment: ExperimentShortInfo) => {
        this.routerStore.push(makeUrlWithParams(routes.experimentResults.path,
            {
                experimentId: experiment.experimentId,
                projectId: getProjectIdFromUrl(this.routerStore.location)
            }
        ));
    }

    public render(): JSX.Element {
        return (
            <div className='project-details'>
                {this.experimentStore.isLoading ?
                    (<BelsimLoader />) :
                    (
                        <>
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