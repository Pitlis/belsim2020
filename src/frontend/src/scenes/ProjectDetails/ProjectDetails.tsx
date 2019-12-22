import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { RouterStore } from 'mobx-react-router';
import { getProjectIdFromUrl } from 'routes/getIdFromUrl';
import { StoresType } from 'stores';
import { routes, makeUrlWithParams } from 'routes';
import { ExperimentStore } from 'stores/Experiment.store';
import { AgGridReact } from '@ag-grid-community/react/lib/agGridReact';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import './ProjectDetails.scss';
import { ExperimentShortInfo, ExperimentStatus } from 'models';

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
        console.log(getProjectIdFromUrl(this.routerStore.location));
        let projectId = getProjectIdFromUrl(this.routerStore.location);
        console.log('-------' + projectId);
        this.experimentStore.loadProjectExperimentsList(projectId);
    }

    handleOpenProjectProductsResources = () => {
        console.log(makeUrlWithParams(routes.projectProductsAndResources.path, { projectId: getProjectIdFromUrl(this.routerStore.location) }));
        this.routerStore.push(makeUrlWithParams(routes.projectProductsAndResources.path, { projectId: getProjectIdFromUrl(this.routerStore.location) }));
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
                <button onClick={this.handleOpenProjectProductsResources}>Редактировать продукты и ресурсы</button>

                {this.experimentStore.isLoading ? (<div>Loading...</div>) : (this.renderExperimentsList())}
            </div >
        );
    }

    private statusFormatter(params: any): string {
        switch (params.value) {
            case 1: {
                return 'Ожидает обработки';
            }
            case 2: {
                return 'В процессе обработки...';
            }
            case 3: {
                return 'Успешно выполнен';
            }
            case 4: {
                return 'Ошибка обработки';
            }
            default: {
                return 'Ошибка обработки';
            }
        }
    }

    renderExperimentsList = () => {
        return (
            <div className='experiments'>
                <div className='title'>Все эксперименты:</div>
                <div className='ag-theme-balham'>
                    <AgGridReact
                        columnDefs={[
                            {
                                headerName: "Автор",
                                field: "ownerName",
                                sortable: true,
                                filter: true,
                                suppressMovable: true
                            },
                            {
                                headerName: "Название",
                                field: "name",
                                sortable: true,
                                filter: true
                            },
                            {
                                headerName: "Модель данных",
                                field: "experimentTemplateName",
                                sortable: true,
                                filter: true
                            },
                            {
                                headerName: "Дата создания",
                                field: "createdAt",
                                sortable: true,
                                filter: true
                            },
                            {
                                headerName: "Текущее состояние",
                                field: "status",
                                sortable: true,
                                filter: true,
                                valueFormatter: this.statusFormatter
                            },
                            {
                                headerName: "Изменен",
                                field: "statusChangedAt",
                                sortable: true,
                                filter: true
                            },
                            {
                                headerName: "",
                                sortable: false,
                                filter: false,
                                cellRendererFramework: (event) => {
                                    return <button className='show-results-button'
                                        disabled={event.data.status != ExperimentStatus.Completed}
                                        onClick={() => this.handleOpenExperimentResults(event.data)}>
                                        Показать результаты
                                        </button>
                                }
                            }
                        ]}
                        rowData={this.experimentStore.projectExperimentsList}
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