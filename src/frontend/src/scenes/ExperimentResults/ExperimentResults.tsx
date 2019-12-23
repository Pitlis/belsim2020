import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ReactEcharts from 'echarts-for-react';
import { when } from 'mobx';
import Select from 'react-select'

import './ExperimentResults.scss';

import { RouterStore, StoresType } from 'stores';
import { ExperimentStore } from 'stores/Experiment.store';
import { getExperimentIdFromUrl } from 'routes/getIdFromUrl';
import { ExperimentResult, ResponseName } from 'models';
import { BelsimLoader } from 'components/BelsimLoader';

let dataTool = require('echarts/extension/dataTool');

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class ExperimentResults extends Component<{ stores?: StoresType }, { selectedExperimentResult: ResponseName | null, isLoading: boolean }> {
    public experimentStore: ExperimentStore;
    public routerStore: RouterStore;

    constructor(props) {
        super(props);
        this.experimentStore = this.props.stores!.ExperimentStore;
        this.routerStore = this.props.stores!.RouterStore;

        this.state = {
            selectedExperimentResult: null,
            isLoading: true
        }
    }

    componentDidMount() {
        let experimentId = getExperimentIdFromUrl(this.routerStore.location);
        this.experimentStore.openExperiment(experimentId);

        when(
            () => !!this.experimentStore.responseNamesList.length,
            () => this.setState({ selectedExperimentResult: this.experimentStore.responseNamesList[0], isLoading: false })
        );
    }

    private handleResponseChanged = (selectedResponse: any) => {
        this.setState({ selectedExperimentResult: this.experimentStore.responseNamesList.find(n => n.originalName === selectedResponse.value) as ResponseName });
    }

    public render(): JSX.Element {
        return (
            <div className='experiment-results'>
                {this.state.isLoading ? (<BelsimLoader />) : (this.renderExperimentResults())}
            </div>
        );
    }

    private renderExperimentResults(): JSX.Element {
        return (
            <div>
                {this.renderResponsesList()}
                results: {this.experimentStore.currenExperiment!.name}
                <ReactEcharts
                    option={this.getOptions(this.getBoxplotData(this.state.selectedExperimentResult!.originalName))}
                    notMerge={true}
                    lazyUpdate={true}
                    theme={"theme_name"}
                    style={{ height: "80vh", left: 50, top: 50, width: "90vw" }}
                />
            </div>
        );
    }

    private renderResponsesList(): JSX.Element {
        const options = this.experimentStore.responseNamesList.map(n => { return { value: n.originalName, label: n.name }; })
        return (
            <Select
                options={options}
                onChange={this.handleResponseChanged}
                value={{
                    value: this.state.selectedExperimentResult!.originalName,
                    label: this.state.selectedExperimentResult!.name
                }}
            />
        );
    }

    private getBoxplotData(responseName: string): any {
        let responses: ExperimentResult[] = [];
        this.experimentStore.currenExperiment!.resultData.forEach(run => {
            let response = run.variables.find(r => r.name === responseName) as ExperimentResult;
            responses.push(response);
        });
        let countMonths = responses[0].timedValues.length;
        let rawData: (number[])[] = [];

        for (let monthIndex = 1; monthIndex < countMonths + 1; monthIndex++) {
            let monthData = responses.map(r => r.timedValues.find(t => t.time === monthIndex)!.value);
            rawData.push(monthData as number[]);
        }
        return dataTool.prepareBoxplotData(rawData);
    }

    private getOptions(boxplotData: any): any {
        let option = {
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                bottom: '15%'
            },
            dataZoom: {
                show: true,
                realtime: true,
                start: 0,
                end: 100
            },
            xAxis: {
                type: 'category',
                data: boxplotData.axisData,
                boundaryGap: true,
                nameGap: 30,
                splitArea: {
                    show: false
                },
                axisLabel: {
                    formatter: (val) => { return "Месяц " + (parseInt(val) + 1).toString(); }
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                name: '',
                splitArea: {
                    show: true
                }
            },
            series: [
                {
                    name: 'boxplot',
                    type: 'boxplot',
                    data: boxplotData.boxData,
                    tooltip: {
                        formatter: function (param) {
                            return [
                                'Месяц ' + (parseInt(param.name) + 1).toString() + ': ',
                                'Максимум: ' + param.data[5],
                                'Верхний квартиль: ' + param.data[4],
                                'Медиана: ' + param.data[3],
                                'Нижний квартиль: ' + param.data[2],
                                'Минимум: ' + param.data[1]
                            ].join('<br/>');
                        }
                    }
                },
                {
                    name: 'Промах',
                    type: 'scatter',
                    data: boxplotData.outliers
                }
            ]
        };
        return option;
    }
}