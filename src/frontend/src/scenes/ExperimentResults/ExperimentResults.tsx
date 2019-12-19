import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ReactEcharts from 'echarts-for-react';

import { RouterStore, StoresType } from 'stores';
import './ExperimentResults.scss';
import { ExperimentStore } from 'stores/Experiment.store';
import { getExperimentIdFromUrl } from 'routes/getIdFromUrl';

let dataTool = require('echarts/extension/dataTool');



let data = dataTool.prepareBoxplotData([
    [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
    [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
    [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
    [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
    [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
]);

console.log(data);

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class ExperimentResults extends Component<{ stores?: StoresType }> {
    public experimentStore: ExperimentStore;
    public routerStore: RouterStore;

    constructor(props) {
        super(props);
        this.experimentStore = this.props.stores!.ExperimentStore;
        this.routerStore = this.props.stores!.RouterStore;

        this.state = {
            responseName: '_Баланс 110: Основные средства',
        }
    }

    componentDidMount() {
        let experimentId = getExperimentIdFromUrl(this.routerStore.location);
        console.log('-------' + experimentId);
        this.experimentStore.openExperiment(experimentId);
    }

    public render(): JSX.Element {
        return (
            <div className='experiment-results'>
                {this.experimentStore.isLoading ? (<div>Loading...</div>) : (this.renderExperimentResults())}
            </div>
        );
    }

    private renderExperimentResults(): JSX.Element {
        return (
            <div>
                {/* results: {this.experimentStore.currenExperiment?.name} */}
                <ReactEcharts
                    option={this.getOptions()}
                    notMerge={true}
                    lazyUpdate={true}
                    theme={"theme_name"} />
            </div>
        );
    }

    private getOptions(): any {
        let option = {
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '15%'
            },
            xAxis: {
                type: 'category',
                data: data.axisData,
                boundaryGap: true,
                nameGap: 30,
                splitArea: {
                    show: false
                },
                axisLabel: {
                    formatter: 'expr {value}'
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                name: 'km/s minus 299,000',
                splitArea: {
                    show: true
                }
            },
            series: [
                {
                    name: 'boxplot',
                    type: 'boxplot',
                    data: data.boxData,
                    tooltip: {
                        formatter: function (param) {
                            return [
                                'Experiment ' + param.name + ': ',
                                'upper: ' + param.data[5],
                                'Q3: ' + param.data[4],
                                'median: ' + param.data[3],
                                'Q1: ' + param.data[2],
                                'lower: ' + param.data[1]
                            ].join('<br/>');
                        }
                    }
                },
                {
                    name: 'outlier',
                    type: 'scatter',
                    data: data.outliers
                }
            ]
        };
        return option;
    }
}