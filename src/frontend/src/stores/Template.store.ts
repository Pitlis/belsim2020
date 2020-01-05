import { action, observable, runInAction, computed } from 'mobx';

import { RkExperimentTemplate, RkExperimentTemplateInfo } from 'models';
import { api } from 'repositories';
import { AbstractControls, FormControl, FormGroup, notEmptyOrSpaces, minValue, required } from '@quantumart/mobx-form-validation-kit';
import { stores } from 'stores';
import { routes, makeUrlWithParams } from 'routes';
import { toCurrency } from 'helpers/gridNumberParser';

interface ICommonInfoControl extends AbstractControls {
    name: FormControl<string>;
    description: FormControl<string>;
}

interface IPlanningControl extends AbstractControls {
    planningInterval: FormControl<number>;
    planningIntervalsCount: FormControl<number>;
}

interface ISupplyControl extends AbstractControls {
    supplyPaymentDate: FormControl<number>;
    supplyPaymentDateStdDev: FormControl<number>;

    supplyPriceChangeCoefficient: FormControl<number>;
    supplyPriceChangeCoefficientStdDev: FormControl<number>;

    supplyPriceChangeInterval: FormControl<number>;
    supplyPriceChangeIntervalStdDev: FormControl<number>;
}

interface IFinanceControl extends AbstractControls {
    settlementAccountVolume: FormControl<number>;

    isCreditUsed: FormControl<boolean>;
    interestRate: FormControl<number>;
    creditInterval: FormControl<number>;
    creditCycle: FormControl<number>;
    liquidityRatio: FormControl<number>;

    replacementCost: FormControl<number>;
    wearFactor: FormControl<number>;
    amortizationQuota: FormControl<number>;
    overvalueCoefficient: FormControl<number>;
}

export const EMPTY_TEMPLATE_ID = 'new';

export class TemplateStore {
    @observable public currentTemplate: RkExperimentTemplate;
    @observable public productIdsInCurrentTemplate: string[];
    @observable public resourceIdsInCurrentTemplate: string[];
    @observable public isTemplateEmpty: boolean;
    @observable public isLoading: boolean;
    @observable public productResourceListChanged: boolean;

    @observable public сommonInfoControlForm: FormGroup<ICommonInfoControl>;
    @observable public planningControlForm: FormGroup<IPlanningControl>;
    @observable public supplyControlForm: FormGroup<ISupplyControl>;
    @observable public financeControlForm: FormGroup<IFinanceControl>;

    @observable public templatesInProject: RkExperimentTemplateInfo[];

    public constructor() {
        this.init();
    }

    @action
    public init(): void {
        this.isLoading = true;
        this.productResourceListChanged = false;
        this.productIdsInCurrentTemplate = new Array<string>();
        this.resourceIdsInCurrentTemplate = new Array<string>();
    }

    @action
    public async openTemplate(templateId: string): Promise<void> {
        this.isLoading = true;
        if (templateId === EMPTY_TEMPLATE_ID) {
            console.log('openTemplate');
            this.currentTemplate = await api.template.getEmptyTemplate();
            runInAction(() => {
                this.isTemplateEmpty = true;
                this.isLoading = false;
            });
        } else {
            this.currentTemplate = await api.template.getTemplate(templateId);
            runInAction(() => {
                this.isTemplateEmpty = false;
                this.productIdsInCurrentTemplate = this.currentTemplate.products.map(p => p.productId);
                this.resourceIdsInCurrentTemplate = this.currentTemplate.resources.map(p => p.resourceId);
                this.productResourceListChanged = false;
                this.isLoading = false;
            });
        }
    }

    @action
    public async loadProjectTemplatesList(projectId: string): Promise<void> {
        this.isLoading = true;
        this.templatesInProject = await api.template.getProjectTemplates(projectId);
        runInAction(() => {
            this.isLoading = false;
        });
    }

    @action
    public async createTemplate(projectId: string): Promise<void> {
        this.isLoading = true;
        if (this.сommonInfoControlForm.valid) {
            let templateId = await api.template.createTemplate(
                this.currentTemplate.name,
                this.currentTemplate.description,
                projectId
            );
            stores.RouterStore.push(makeUrlWithParams(routes.template.path, { templateId, projectId }));
            runInAction(() => {
                this.openTemplate(templateId);
            });
        }
    }

    @computed
    public get isTemplateValid(): boolean {
        console.log('isTemplateValid');
        if (!this.currentTemplate.rkExperimentTemplateId) {
            return (
                (this.сommonInfoControlForm ? this.сommonInfoControlForm.valid : true)
                && true
            );
        } else {
            return (
                (this.сommonInfoControlForm ? this.сommonInfoControlForm.valid : true)
                && true
            );
        }
    }

    @action
    public addProductToTemplateList(productId: string) {
        console.log(productId);
        this.productIdsInCurrentTemplate.push(productId);
        this.productResourceListChanged = true;
    }

    @action
    public removeProductFromTemplateList(productId: string) {
        this.productIdsInCurrentTemplate = this.productIdsInCurrentTemplate.filter(id => id !== productId);
        this.productResourceListChanged = true;
    }

    @action
    public addResourceToTemplateList(resourceId: string) {
        this.resourceIdsInCurrentTemplate.push(resourceId);
        this.productResourceListChanged = true;
    }

    @action
    public removeResourceFromTemplateList(resourceId: string) {
        this.resourceIdsInCurrentTemplate = this.resourceIdsInCurrentTemplate.filter(id => id !== resourceId);
        this.productResourceListChanged = true;
    }

    @action
    public async saveTemplate() {
        this.isLoading = true;

        await api.template.updateTemplate(this.currentTemplate);
        console.log(this.productResourceListChanged);
        if (this.productResourceListChanged) {
            await api.template.updateProductsList(this.currentTemplate.rkExperimentTemplateId, this.productIdsInCurrentTemplate);
            await api.template.updateResourcesList(this.currentTemplate.rkExperimentTemplateId, this.resourceIdsInCurrentTemplate);
        }
        runInAction(() => {
            this.openTemplate(this.currentTemplate.rkExperimentTemplateId);
        });
    }

    @action
    public addResourceToProduct(rkProductInExperimentId: string, rkResourceInExperimentId: string) {
        console.log('addResourceToProduct');
        let product = this.currentTemplate.products.find(p => p.rkProductInExperimentId === rkProductInExperimentId);
        console.log(product);
        product!.resources.push({ rkResourceInExperimentId: rkResourceInExperimentId, resourceConsumption: 1, });
    }

    @action
    public changeResourceConsumation(rkProductInExperimentId: string, rkResourceInExperimentId: string, count: number) {
        let product = this.currentTemplate.products.find(p => p.rkProductInExperimentId === rkProductInExperimentId);
        if (count === 0) {
            product!.resources = product!.resources.filter(r => r.rkResourceInExperimentId !== rkResourceInExperimentId);
        }
        else {
            let resourceInProduct = product!.resources.find(r => r.rkResourceInExperimentId === rkResourceInExperimentId);
            resourceInProduct!.resourceConsumption = count;
        }
    }


    // controls

    @action
    public initCommonInfoControlForm(): void {
        this.сommonInfoControlForm = new FormGroup<ICommonInfoControl>({
            name: new FormControl(
                this.currentTemplate.name,
                [notEmptyOrSpaces('SHOULD_NOT_BE_EMPTY')],
                v => (this.currentTemplate.name = v)
            ),
            description: new FormControl(
                this.currentTemplate.description,
                [],
                v => (this.currentTemplate.description = v)
            ),
        });
    }

    @action
    public initPlanningControlForm(): void {
        this.planningControlForm = new FormGroup<IPlanningControl>({
            planningInterval: new FormControl(
                this.currentTemplate.planningInterval,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.planningInterval = Math.trunc(v))
            ),
            planningIntervalsCount: new FormControl(
                this.currentTemplate.planningIntervalsCount,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.planningIntervalsCount = Math.trunc(v))
            )
        });
    }

    @action
    public initSupplyControlForm(): void {
        this.supplyControlForm = new FormGroup<ISupplyControl>({
            supplyPaymentDate: new FormControl(
                this.currentTemplate.supplyPaymentDate,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.supplyPaymentDate = Math.trunc(v))
            ),
            supplyPaymentDateStdDev: new FormControl(
                this.currentTemplate.supplyPaymentDateStdDev,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.supplyPaymentDateStdDev = Math.trunc(v))
            ),
            supplyPriceChangeCoefficient: new FormControl(
                this.currentTemplate.supplyPriceChangeCoefficient,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.supplyPriceChangeCoefficient = Number(Number(v).toFixed(4)))
            ),
            supplyPriceChangeCoefficientStdDev: new FormControl(
                this.currentTemplate.supplyPriceChangeCoefficientStdDev,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.supplyPriceChangeCoefficientStdDev = Number(Number(v).toFixed(4)))
            ),
            supplyPriceChangeInterval: new FormControl(
                this.currentTemplate.supplyPriceChangeInterval,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.supplyPriceChangeInterval = Math.trunc(v))
            ),
            supplyPriceChangeIntervalStdDev: new FormControl(
                this.currentTemplate.supplyPriceChangeIntervalStdDev,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.supplyPriceChangeIntervalStdDev = Math.trunc(v))
            )
        });
    }

    @action
    public initFinanceControlForm(): void {
        this.financeControlForm = new FormGroup<IFinanceControl>({
            settlementAccountVolume: new FormControl(
                this.currentTemplate.settlementAccountVolume,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.settlementAccountVolume = toCurrency(v))
            ),
            isCreditUsed: new FormControl(
                this.currentTemplate.isCreditUsed,
                [],
                v => (this.currentTemplate.isCreditUsed = v)
            ),
            interestRate: new FormControl(
                this.currentTemplate.interestRate,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.interestRate = Number(Number(v).toFixed(4)))
            ),
            creditInterval: new FormControl(
                this.currentTemplate.creditInterval,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.creditInterval = Math.trunc(v))
            ),
            creditCycle: new FormControl(
                this.currentTemplate.creditCycle,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.creditCycle = Math.trunc(v))
            ),
            liquidityRatio: new FormControl(
                this.currentTemplate.liquidityRatio,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.liquidityRatio = Number(Number(v).toFixed(4)))
            ),
            replacementCost: new FormControl(
                this.currentTemplate.replacementCost,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.replacementCost = toCurrency(v))
            ),
            wearFactor: new FormControl(
                this.currentTemplate.wearFactor,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.wearFactor = Number(Number(v).toFixed(4)))
            ),
            amortizationQuota: new FormControl(
                this.currentTemplate.amortizationQuota,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.amortizationQuota = Number(Number(v).toFixed(4)))
            ),
            overvalueCoefficient: new FormControl(
                this.currentTemplate.overvalueCoefficient,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.overvalueCoefficient = Number(Number(v).toFixed(4)))
            ),
        });
    }
}

