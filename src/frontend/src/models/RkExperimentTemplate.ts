import { ExperimentAccount, ExperimentResource, ExperimentProduct } from "models";

export enum DistrFuncTypes {
    Uniform = 0, // равномерное
    Exponential = 1, // показательное
    Normal = 2
}

export class RkExperimentTemplate {
    public rkExperimentTemplateId: string;

    public ownerId: string;

    public createdAt: Date;
    public modifiedAt: Date;

    public name: string;
    public description: string;

    public accounts: ExperimentAccount[];
    public products: ExperimentProduct[];
    public resources: ExperimentResource[];



    //// Experiment settings

    // Число параллельных опытов
    public countRuns: number;

    // Период времени (мес.)
    public period: number;

    // Интервал сбора статистики (мес.)
    public interval: number;



    //// Planning

    // План-график производства: Интервал планирования (дн.)
    public planningInterval: number;

    // План-график производства: Количество интервалов планирования (ед.)
    public planningIntervalsCount: number;



    //// Realization

    // Реализация: Количество отгрузок: (ед.)
    public shipmentsCount: number;

    // Реализация: Интервал между отгрузками: Среднее (дн.)
    public shippingCycle: number;

    // Реализация: Интервал между отгрузками: Стандартное отклонение (дн.)
    public shippingCycleStdDev: number;

    // Реализация: Интервал между отгрузками: Вид функции плотности распределения (0;1;2)
    public shippingCycleDistrFuncType: DistrFuncTypes;

    // Реализация: Срок платежа: Среднее (дн.)
    public paymentDate: number;

    // Реализация: Срок платежа: Стандартное отклонение (дн.)
    public paymentDateStdDev: number;

    // Реализация: Срок платежа: Вид фукнции плотности распределения (0;1;2)
    publicpaymentDateDistrFuncType: DistrFuncTypes

    // Реализация: Коэффициент изменения цен (отн.ед./мес.)
    public priceChangeCoefficient: number;

    // Реализация: Коэффициент изменения цен: Стандартное отклонение (отн.ед.)
    public priceChangeCoefficientStdDev: number;

    // Реализация: Коэффициент изменения цен: Вид функции плотности распределения (0;1;2)
    public priceChangeCoefficientDistrFuncType: DistrFuncTypes

    // Реализация: Интервал между изменениями цен: Среднее (дн.)
    public priceChangeInterval: number;

    // Реализация: Интервал между изменениями цен: Среднее (дн.)
    public priceChangeIntervalStdDev: number;

    // Реализация: Интервал между изменениями цен: Вид функции плотности распределения (0;1;2)
    public priceChangeIntervalDistrFuncType: DistrFuncTypes



    //// Supply

    // Снабжение: Срок платежа: Среднее (дн.)
    public supplyPaymentDate: number;

    // Снабжение: Срок платежа: Стандартное отклонение (дн.)
    public supplyPaymentDateStdDev: number;

    // Снабжение: Срок платежа: Вид фукнции плотности распределения (0;1;2)
    public supplyPaymentDateDistrFuncType: DistrFuncTypes

    // Снабжение: Коэффициент изменения цен (отн.ед./мес.)
    public supplyPriceChangeCoefficient: number;

    // Снабжение: Коэффициент изменения цен: Стандартное отклонение (отн.ед.)
    public supplyPriceChangeCoefficientStdDev: number;

    // Снабжение: Коэффициент изменения цен: Вид функции плотности распределения (0;1;2)
    public supplyPriceChangeCoefficientDistrFuncType: DistrFuncTypes

    // Снабжение: Интервал между изменениями цен: Среднее (дн.)
    public supplyPriceChangeInterval: number;

    // Снабжение: Интервал между изменениями цен: Стандартное отклонение (дн.)
    public supplyPriceChangeIntervalStdDev: number;

    // Снабжение: Интервал между изменениями цен: Вид функции плотности распределения (0;1;2)
    public supplyPriceChangeIntervalDistrFuncType: DistrFuncTypes



    //// Finances

    // Финансы: Сумма на расчетном счету (руб.)
    public settlementAccountVolume: number;



    //// Credit

    // Кредит: Использование для покрытия нехватки денежных средств (0;1)
    public isCreditUsed: boolean

    // Кредит: Процентная ставка (отн.ед./год)
    public interestRate: number;

    // Кредит: Интервал между обращениями (дн.)
    public creditInterval: number;

    // Кредит: Срок (дн.)
    public creditCycle: number;

    // Кредит: Коэффициент покрытия нехватки денежных средств (отн.ед.)
    public liquidityRatio: number;



    //// Costs

    // Затраты: Постоянные (руб./мес.)
    public fixedCosts: number;

    // Затраты: Доля заработной платы в постоянных затратах (отн.ед.)
    public wageShare: number;

    // Затраты: Коэффициент изменения (отн.ед./мес.)
    public costsChangeCoefficient: number;

    // Затраты: Коэффициент изменения: Стандартное отклонение (отн.ед.)
    public dostsChangeStdDev: number;

    // Затраты: Коэффициент изменения: Вид функции плотности распределения (0;1;2)
    public costsChangeDistrFuncType: DistrFuncTypes

    // Затраты: Интервал между изменениями: Среднее (дн.)
    public costsChangeInterval: number;

    // Затраты: Интервал между изменениями: Стандартное отклонение (дн.)
    public costsChangeIntervalStdDev: number;

    // Затраты: Интервал между изменениями: Вид функции плотности распределения (0;1;2)
    public costsChangeIntervalDistrFuncType: DistrFuncTypes



    //// Fixed Assets

    // Основные средства: Восстановительная стоимость (руб.)
    public replacementCost: number;

    // Основные средства: Коэффициент износа (отн.ед.)
    public wearFactor: number;

    // Основные средства: Норма амортизации (отн.ед./год)
    public amortizationQuota: number;

    // Основные средства: Коэффициент переоценки (отн.ед./год)
    public overvalueCoefficient: number;

}