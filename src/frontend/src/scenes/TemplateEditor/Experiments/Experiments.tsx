import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button } from 'react-bootstrap';

import './Experiments.scss';

import { TemplateStore, StoresType, ProjectStore, ExperimentStore, RouterStore } from 'stores';
import { BelsimLoader } from 'components/BelsimLoader';
import { ExperimentsList } from 'components/ExperimentsList';
import { ExperimentShortInfo } from 'models';
import { routes, makeUrlWithParams } from 'routes';
import { BelsimInput } from 'components/BelsimInput';


@inject((stores: StoresType) => ({
    stores
}))
@observer
export class Experiments extends Component<{ stores?: StoresType }, { isExperimentCreating: boolean }> {
    public templateStore: TemplateStore;
    public projectStore: ProjectStore;
    public experimentStore: ExperimentStore;
    public routerStore: RouterStore;

    constructor(props) {
        super(props);
        this.templateStore = this.props.stores!.TemplateStore;
        this.projectStore = this.props.stores!.ProjectStore;
        this.experimentStore = this.props.stores!.ExperimentStore;
        this.routerStore = this.props.stores!.RouterStore;

        this.state = {
            isExperimentCreating: false
        };

        this.templateStore.initRunExperimentControlForm();
    }

    componentDidMount() {
        this.experimentStore.loadProjectExperimentsList(this.projectStore.currenProject.projectId);
    }

    componentWillUnmount() {
        this.templateStore.runExperimentControlForm.dispose();
    }

    handleOpenExperimentResults = (experiment: ExperimentShortInfo) => {
        this.routerStore.push(makeUrlWithParams(routes.experimentResults.path,
            {
                experimentId: experiment.experimentId,
                projectId: this.projectStore.currenProject.projectId
            }
        ));
    }

    handleRunExperiment = async () => {
        this.setState({ isExperimentCreating: true });
        await this.templateStore.saveTemplate();
        await this.templateStore.runNewExperiment();
        await this.templateStore.openTemplate(this.templateStore.currentTemplate.rkExperimentTemplateId);
        await this.experimentStore.loadProjectExperimentsList(this.projectStore.currenProject.projectId);
        this.setState({ isExperimentCreating: false });
    }

    public render(): JSX.Element {
        return (
            <>
                {this.templateStore.isLoading || this.state.isExperimentCreating
                    ? <BelsimLoader />
                    : (
                        <div className='experiments'>
                            {this.renderNewExperiment()}
                            <hr />
                            <div className='title'>Список экспериментов, запущенных из данной модели</div>
                            {this.renderExperimentsList()}
                        </div>
                    )
                }
            </>
        );
    }

    private renderNewExperiment(): JSX.Element {
        return (
            <div className='run-experiment'>
                <Form noValidate>
                    <BelsimInput
                        inputType='text'
                        formControl={this.templateStore.runExperimentControlForm.controls.name}
                        showErrors={this.templateStore.runExperimentControlForm.controls.name.touched}
                        fieldName='Название нового эксперимента:'
                        className='name'
                    ></BelsimInput>
                </Form>
                <Form noValidate className='period-interval'>
                    <BelsimInput
                        inputType='number'
                        formControl={this.templateStore.runExperimentControlForm.controls.period}
                        showErrors={this.templateStore.runExperimentControlForm.controls.period.touched}
                        fieldName='Период времени (мес.):'
                        className='name'
                    ></BelsimInput>
                    <BelsimInput
                        inputType='number'
                        formControl={this.templateStore.runExperimentControlForm.controls.interval}
                        showErrors={this.templateStore.runExperimentControlForm.controls.interval.touched}
                        fieldName='Интервал сбора статистики (мес.):'
                        className='name'
                    ></BelsimInput>
                </Form>
                {this.renderErrors()}
                <div className='run-button'>
                    <Button
                        disabled={this.templateStore.runExperimentControlForm.controls.name.invalid || this.getErrors().length > 0}
                        onClick={this.handleRunExperiment}
                        variant="success"
                        className='belsim-run-button'
                    >
                        Сохранить модель и запустить эксперимент
                </Button>
                </div>
            </div>
        );
    }

    private renderErrors(): JSX.Element {
        return (
            <div className='model-errors'>
                {this.getErrors().map(e => <div className='error'>{e}</div>)}
            </div>
        );
    }

    private renderExperimentsList(): JSX.Element {
        return (
            <div className='experiments-list'>
                {this.experimentStore.isLoading
                    ? (<BelsimLoader />)
                    :
                    (<ExperimentsList
                        title=''
                        experiments={this.experimentStore.projectExperimentsList.filter(e => e.experimentTemplateId === this.templateStore.currentTemplate.rkExperimentTemplateId)}
                        onOpenResults={this.handleOpenExperimentResults}
                    />)
                }
            </div>
        );
    }

    private getErrors(): string[] {
        let errors = new Array<string>();
        if (this.templateStore.currentTemplate.products.length === 0) {
            errors.push('Модель должна содержать хотя бы один продукт');
        }
        if (this.templateStore.currentTemplate.resources.length === 0) {
            errors.push('Модель должна содержать хотя бы один ресурс');
        }

        return errors;
    }
}