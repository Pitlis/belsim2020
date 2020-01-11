import { action, observable, runInAction, computed } from 'mobx';

import { RkExperimentTemplate, RkExperimentTemplateInfo, ExperimentProduct, ExperimentShipment } from 'models';
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

interface IShipmentControl extends AbstractControls {
    shippingCycle: FormControl<number>;
    shippingCycleStdDev: FormControl<number>;

    paymentDate: FormControl<number>;
    paymentDateStdDev: FormControl<number>;

    priceChangeCoefficient: FormControl<number>;
    priceChangeCoefficientStdDev: FormControl<number>;

    priceChangeInterval: FormControl<number>;
    priceChangeIntervalStdDev: FormControl<number>;
}

interface IConstsControl extends AbstractControls {
    fixedCosts: FormControl<number>;
    wageShare: FormControl<number>;

    costsChangeCoefficient: FormControl<number>;
    dostsChangeStdDev: FormControl<number>;

    costsChangeInterval: FormControl<number>;
    costsChangeIntervalStdDev: FormControl<number>;
}

interface ITaxesControl extends AbstractControls {
    vat: FormControl<number>;
    earningsTax: FormControl<number>;
    profitsTax: FormControl<number>;
    restProfitsTax: FormControl<number>;
    fundTax: FormControl<number>;
    wageTax: FormControl<number>;
    realEstateTax: FormControl<number>;
    ecologicalTax: FormControl<number>;
    landTax: FormControl<number>;
}

interface IRunExperimentControl extends AbstractControls {
    name: FormControl<string>;
    period: FormControl<number>;
    interval: FormControl<number>;
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
    @observable public shipmentControlForm: FormGroup<IShipmentControl>;
    @observable public costsControlForm: FormGroup<IConstsControl>;
    @observable public taxesControlForm: FormGroup<ITaxesControl>;
    @observable public runExperimentControlForm: FormGroup<IRunExperimentControl>;

    @observable public templatesInProject: RkExperimentTemplateInfo[];

    @observable public runExperimentName: string;


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
        try {
            if (templateId === EMPTY_TEMPLATE_ID) {
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

                    this.currentTemplate.products.forEach(product => {
                        this.initProductShipments(product);
                    });

                    this.productResourceListChanged = false;
                    this.isLoading = false;
                });
            }
        } catch (err) {
            console.log(err);
            stores.ErrorStore.addError('Ошибка модели данных. Попробуйте обновить страницу.');
        }
    }

    @action
    public async loadProjectTemplatesList(projectId: string): Promise<void> {
        this.isLoading = true;
        try {
            this.templatesInProject = await api.template.getProjectTemplates(projectId);
            runInAction(() => {
                this.isLoading = false;
            });
        } catch (err) {
            console.log(err);
            stores.ErrorStore.addError('Ошибка загрузки списка моделей данных. Попробуйте обновить страницу.');
        }
    }

    @action
    public async createTemplate(projectId: string): Promise<void> {
        this.isLoading = true;
        try {
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
            };
        } catch (err) {
            console.log(err);
            stores.ErrorStore.addError('Ошибка создания модели данных. Попробуйте снова');
        }
    }

    @computed
    public get isTemplateValid(): boolean {
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
        try {
            await api.template.updateTemplate(this.currentTemplate);
            if (this.productResourceListChanged) {
                await api.template.updateProductsList(this.currentTemplate.rkExperimentTemplateId, this.productIdsInCurrentTemplate);
                await api.template.updateResourcesList(this.currentTemplate.rkExperimentTemplateId, this.resourceIdsInCurrentTemplate);
            }
            runInAction(() => {
                this.openTemplate(this.currentTemplate.rkExperimentTemplateId);
            });
        } catch (err) {
            console.log(err);
            stores.ErrorStore.addError('Ошибка сохранения модели данных. Попробуйте снова.');
        }
    }

    @action
    public addResourceToProduct(rkProductInExperimentId: string, rkResourceInExperimentId: string) {
        let product = this.currentTemplate.products.find(p => p.rkProductInExperimentId === rkProductInExperimentId);
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

    @action
    public initProductShipments(product: ExperimentProduct) {
        if (product.shipments.length !== this.currentTemplate.shipmentsCount) {
            let shipments: ExperimentShipment[] = [];
            for (let shipmentIndex = 0; shipmentIndex < this.currentTemplate.shipmentsCount; shipmentIndex++) {
                shipments.push({ volume: 0, shipmentDatetime: shipmentIndex })
            }
            product.shipments = shipments;
        }
    }

    @action
    public addProductsShipment() {
        this.currentTemplate.products.forEach(p => {
            p.shipments.push({ volume: 0, shipmentDatetime: p.shipments.length })
        });
        this.currentTemplate.shipmentsCount = this.currentTemplate.products[0].shipments.length;
    }

    @action
    public removeLastProductsShipment() {
        if (this.currentTemplate.products && this.currentTemplate.products[0].shipments.length > 0) {
            let product = this.currentTemplate.products[0];
            let lastShipmentMonth = product.shipments
                .sort((s1, s2) => s1.shipmentDatetime - s2.shipmentDatetime)[product.shipments.length - 1].shipmentDatetime;

            this.currentTemplate.products.forEach(p => {
                p.shipments = p.shipments.filter(s => s.shipmentDatetime !== lastShipmentMonth);
            });
        }
        this.currentTemplate.shipmentsCount = this.currentTemplate.products[0].shipments.length;
    }

    @action
    public async runNewExperiment(): Promise<void> {
        this.isLoading = true;
        try {
            await api.template.createExperimentFromTemplate(this.currentTemplate.rkExperimentTemplateId, this.runExperimentName);
            runInAction(() => {
                this.isLoading = false;
            })
        } catch (err) {
            console.log(err);
            stores.ErrorStore.addError('Ошибка запуска эксперимента. Попробуйте снова.');
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

    @action
    public initShipmentControlForm(): void {
        this.shipmentControlForm = new FormGroup<IShipmentControl>({
            shippingCycle: new FormControl(
                this.currentTemplate.shippingCycle,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.shippingCycle = Math.trunc(v))
            ),
            shippingCycleStdDev: new FormControl(
                this.currentTemplate.shippingCycleStdDev,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.shippingCycleStdDev = Math.trunc(v))
            ),
            paymentDate: new FormControl(
                this.currentTemplate.paymentDate,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.paymentDate = Math.trunc(v))
            ),
            paymentDateStdDev: new FormControl(
                this.currentTemplate.paymentDateStdDev,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.paymentDateStdDev = Math.trunc(v))
            ),
            priceChangeCoefficient: new FormControl(
                this.currentTemplate.priceChangeCoefficient,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.priceChangeCoefficient = Number(Number(v).toFixed(4)))
            ),
            priceChangeCoefficientStdDev: new FormControl(
                this.currentTemplate.priceChangeCoefficientStdDev,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.priceChangeCoefficientStdDev = Number(Number(v).toFixed(4)))
            ),
            priceChangeInterval: new FormControl(
                this.currentTemplate.priceChangeInterval,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.priceChangeInterval = Math.trunc(v))
            ),
            priceChangeIntervalStdDev: new FormControl(
                this.currentTemplate.priceChangeIntervalStdDev,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.priceChangeIntervalStdDev = Math.trunc(v))
            )
        });
    }

    @action
    public initCostsControlForm(): void {
        this.costsControlForm = new FormGroup<IConstsControl>({
            fixedCosts: new FormControl(
                this.currentTemplate.fixedCosts,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.fixedCosts = toCurrency(v))
            ),
            wageShare: new FormControl(
                this.currentTemplate.wageShare,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.wageShare = Number(Number(v).toFixed(4)))
            ),
            costsChangeCoefficient: new FormControl(
                this.currentTemplate.costsChangeCoefficient,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.costsChangeCoefficient = Number(Number(v).toFixed(4)))
            ),
            dostsChangeStdDev: new FormControl(
                this.currentTemplate.dostsChangeStdDev,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.dostsChangeStdDev = Number(Number(v).toFixed(4)))
            ),
            costsChangeInterval: new FormControl(
                this.currentTemplate.costsChangeInterval,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.costsChangeInterval = Math.trunc(v))
            ),
            costsChangeIntervalStdDev: new FormControl(
                this.currentTemplate.costsChangeIntervalStdDev,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.costsChangeIntervalStdDev = Math.trunc(v))
            )
        });
    }

    @action
    public initTaxesControlForm(): void {
        this.taxesControlForm = new FormGroup<ITaxesControl>({
            vat: new FormControl(
                this.currentTemplate.vat,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.vat = Number(Number(v).toFixed(2)))
            ),
            earningsTax: new FormControl(
                this.currentTemplate.earningsTax,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.earningsTax = Number(Number(v).toFixed(2)))
            ),
            profitsTax: new FormControl(
                this.currentTemplate.profitsTax,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.profitsTax = Number(Number(v).toFixed(2)))
            ),
            restProfitsTax: new FormControl(
                this.currentTemplate.restProfitsTax,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.restProfitsTax = Number(Number(v).toFixed(2)))
            ),
            fundTax: new FormControl(
                this.currentTemplate.fundTax,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.fundTax = Number(Number(v).toFixed(2)))
            ),
            wageTax: new FormControl(
                this.currentTemplate.wageTax,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.wageTax = Number(Number(v).toFixed(2)))
            ),
            realEstateTax: new FormControl(
                this.currentTemplate.realEstateTax,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.realEstateTax = Number(Number(v).toFixed(2)))
            ),
            ecologicalTax: new FormControl(
                this.currentTemplate.ecologicalTax,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.ecologicalTax = toCurrency(v))
            ),
            landTax: new FormControl(
                this.currentTemplate.landTax,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.landTax = toCurrency(v))
            )
        });
    }

    @action
    public initRunExperimentControlForm(): void {
        this.runExperimentName = 'Новый эксперимент';
        this.runExperimentControlForm = new FormGroup<IRunExperimentControl>({
            name: new FormControl(
                this.runExperimentName,
                [notEmptyOrSpaces('SHOULD_NOT_BE_EMPTY')],
                v => (this.runExperimentName = v)
            ),
            period: new FormControl(
                this.currentTemplate.period,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.period = Math.trunc(v))
            ),
            interval: new FormControl(
                this.currentTemplate.interval,
                [required('SHOULD_NOT_BE_EMPTY'), minValue(0, 'MORE_OR_ZERO')],
                v => (this.currentTemplate.interval = Math.trunc(v))
            )
        });
    }
}

