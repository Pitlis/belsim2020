import React, { PureComponent } from 'react';
import { AgGridReact } from '@ag-grid-community/react/lib/agGridReact';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { observer } from 'mobx-react';

import './ExperimentsList.scss';

import { ExperimentShortInfo, ExperimentStatus } from 'models';
import { formatDate } from 'helpers/dateFormatter';

interface IOwnProps {
    experiments: ExperimentShortInfo[];
    onOpenResults: (experiment: ExperimentShortInfo) => void;
    title: string;
}

@observer
export class ExperimentsList extends PureComponent<IOwnProps> {

    handleOpenResult = (experiment: ExperimentShortInfo) => {
        this.props.onOpenResults(experiment);
    }

    render() {
        return (
            <div className='experiments-list'>
                <div className='title'>{this.props.title}</div>
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
                                filter: true,
                                suppressMovable: true
                            },
                            {
                                headerName: "Модель данных",
                                field: "experimentTemplateName",
                                sortable: true,
                                filter: true,
                                suppressMovable: true
                            },
                            {
                                headerName: "Дата создания",
                                field: "createdAt",
                                sortable: true,
                                filter: true,
                                suppressMovable: true,
                                valueFormatter: this.dateFormatter,
                                sort: 'desc'
                            },
                            {
                                headerName: "Текущее состояние",
                                field: "status",
                                sortable: true,
                                filter: true,
                                valueFormatter: this.statusFormatter,
                                suppressMovable: true
                            },
                            {
                                headerName: "Изменен",
                                field: "statusChangedAt",
                                sortable: true,
                                filter: true,
                                suppressMovable: true,
                                valueFormatter: this.dateFormatter
                            },
                            {
                                headerName: "",
                                sortable: false,
                                filter: false,
                                suppressMovable: true,
                                cellRendererFramework: (event) => {
                                    return <button className='show-results-button'
                                        disabled={event.data.status !== ExperimentStatus.Completed}
                                        onClick={() => this.handleOpenResult(event.data)}>
                                        Показать результаты
                                    </button>
                                }
                            }
                        ]}
                        rowData={this.props.experiments}
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

    private statusFormatter(params: { value: number }): string {
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

    private dateFormatter(params: { value: Date }): string {
        return formatDate(params.value);
    }
}