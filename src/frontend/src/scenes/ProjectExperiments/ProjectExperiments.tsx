import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';

import './ProjectExperiments.scss';

import { StoresType, ProjectStore, ExperimentStore } from 'stores';
import { routes, makeUrlWithParams } from 'routes';
import { ExperimentShortInfo } from 'models';
import { ExperimentsList } from 'components/ExperimentsList';
import { BelsimLoader } from 'components/BelsimLoader';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class ProjectExperiments extends Component<{ stores: StoresType }, { selectedExperiment: ExperimentShortInfo | null }> {
    public routerStore: RouterStore;
    public experimentStore: ExperimentStore;
    public projectStore: ProjectStore;

    constructor(props) {
        super(props);
        this.routerStore = this.props.stores!.RouterStore;
        this.experimentStore = this.props.stores!.ExperimentStore;
        this.projectStore = this.props.stores!.ProjectStore;

        this.state = {
            selectedExperiment: null
        };
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

    public render(): JSX.Element {
        return (
            <div className='project-experiments'>
                {this.experimentStore.isLoading
                    ? (<BelsimLoader />)
                    :
                    (<ExperimentsList
                        title=''
                        experiments={this.experimentStore.projectExperimentsList}
                        onOpenResults={this.handleOpenExperimentResults}
                    />)
                }
            </div>
        );
    }
}