using System;
using System.Collections.Generic;

namespace belsim2020.Integration.Models.ApiModels
{
    public class ApiExperimentModel
    {
        public Guid RkExperimentTemplateId { get; set; }

        public string OwnerId { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }

        public IList<ApiExperimentAccountModel> Accounts { get; set; }
        public IList<ApiExperimentProductModel> Products { get; set; }
        public IList<ApiExperimentResourceModel> Resources { get; set; }

        #region Experiment settings

        // Число параллельных опытов
        public int CountRuns { get; set; }

        // Период времени (мес.)
        public int Period { get; set; }

        // Интервал сбора статистики (мес.)
        public int Interval { get; set; }

        #endregion

        #region Planning

        // План-график производства: Интервал планирования (дн.)
        public int PlanningInterval { get; set; }

        // План-график производства: Количество интервалов планирования (ед.)
        public int PlanningIntervalsCount { get; set; }

        #endregion

        #region Realization

        // Реализация: Количество отгрузок: (ед.)
        public int ShipmentsCount { get; set; }

        // Реализация: Интервал между отгрузками: Среднее (дн.)
        public int ShippingCycle { get; set; }

        // Реализация: Интервал между отгрузками: Стандартное отклонение (дн.)
        public int ShippingCycleStdDev { get; set; }

        // Реализация: Интервал между отгрузками: Вид функции плотности распределения (0;1;2)
        public DistrFuncTypes ShippingCycleDistrFuncType { get; set; }

        // Реализация: Срок платежа: Среднее (дн.)
        public int PaymentDate { get; set; }

        // Реализация: Срок платежа: Стандартное отклонение (дн.)
        public int PaymentDateStdDev { get; set; }

        // Реализация: Срок платежа: Вид фукнции плотности распределения (0;1;2)
        public DistrFuncTypes PaymentDateDistrFuncType { get; set; }

        // Реализация: Коэффициент изменения цен (отн.ед./мес.)
        public decimal PriceChangeCoefficient { get; set; }

        // Реализация: Коэффициент изменения цен: Стандартное отклонение (отн.ед.)
        public decimal PriceChangeCoefficientStdDev { get; set; }

        // Реализация: Коэффициент изменения цен: Вид функции плотности распределения (0;1;2)
        public DistrFuncTypes PriceChangeCoefficientDistrFuncType { get; set; }

        // Реализация: Интервал между изменениями цен: Среднее (дн.)
        public int PriceChangeInterval { get; set; }

        // Реализация: Интервал между изменениями цен: Среднее (дн.)
        public int PriceChangeIntervalStdDev { get; set; }

        // Реализация: Интервал между изменениями цен: Вид функции плотности распределения (0;1;2)
        public DistrFuncTypes PriceChangeIntervalDistrFuncType { get; set; }

        #endregion

        #region Supply

        // Снабжение: Срок платежа: Среднее (дн.)
        public int SupplyPaymentDate { get; set; }

        // Снабжение: Срок платежа: Стандартное отклонение (дн.)
        public int SupplyPaymentDateStdDev { get; set; }

        // Снабжение: Срок платежа: Вид фукнции плотности распределения (0;1;2)
        public DistrFuncTypes SupplyPaymentDateDistrFuncType { get; set; }

        // Снабжение: Коэффициент изменения цен (отн.ед./мес.)
        public decimal SupplyPriceChangeCoefficient { get; set; }

        // Снабжение: Коэффициент изменения цен: Стандартное отклонение (отн.ед.)
        public decimal SupplyPriceChangeCoefficientStdDev { get; set; }

        // Снабжение: Коэффициент изменения цен: Вид функции плотности распределения (0;1;2)
        public DistrFuncTypes SupplyPriceChangeCoefficientDistrFuncType { get; set; }

        // Снабжение: Интервал между изменениями цен: Среднее (дн.)
        public int SupplyPriceChangeInterval { get; set; }

        // Снабжение: Интервал между изменениями цен: Стандартное отклонение (дн.)
        public decimal SupplyPriceChangeIntervalStdDev { get; set; }

        // Снабжение: Интервал между изменениями цен: Вид функции плотности распределения (0;1;2)
        public DistrFuncTypes SupplyPriceChangeIntervalDistrFuncType { get; set; }

        #endregion

        #region Finances

        // Финансы: Сумма на расчетном счету (руб.)
        public decimal SettlementAccountVolume { get; set; }

        #endregion

        #region Credit

        // Кредит: Использование для покрытия нехватки денежных средств (0;1)
        public bool IsCreditUsed { get; set; }

        // Кредит: Процентная ставка (отн.ед./год)
        public decimal InterestRate { get; set; }

        // Кредит: Интервал между обращениями (дн.)
        public int CreditInterval { get; set; }

        // Кредит: Срок (дн.)
        public int CreditCycle { get; set; }

        // Кредит: Коэффициент покрытия нехватки денежных средств (отн.ед.)
        public decimal LiquidityRatio { get; set; }

        #endregion

        #region Costs

        // Затраты: Постоянные (руб./мес.)
        public decimal FixedCosts { get; set; }

        // Затраты: Доля заработной платы в постоянных затратах (отн.ед.)
        public decimal WageShare { get; set; }

        // Затраты: Коэффициент изменения (отн.ед./мес.)
        public decimal CostsChangeCoefficient { get; set; }

        // Затраты: Коэффициент изменения: Стандартное отклонение (отн.ед.)
        public decimal CostsChangeStdDev { get; set; }

        // Затраты: Коэффициент изменения: Вид функции плотности распределения (0;1;2)
        public DistrFuncTypes CostsChangeDistrFuncType { get; set; }

        // Затраты: Интервал между изменениями: Среднее (дн.)
        public int CostsChangeInterval { get; set; }

        // Затраты: Интервал между изменениями: Стандартное отклонение (дн.)
        public int CostsChangeIntervalStdDev { get; set; }

        // Затраты: Интервал между изменениями: Вид функции плотности распределения (0;1;2)
        public DistrFuncTypes CostsChangeIntervalDistrFuncType { get; set; }

        #endregion

        #region Fixed Assets

        // Основные средства: Восстановительная стоимость (руб.)
        public decimal ReplacementCost { get; set; }

        // Основные средства: Коэффициент износа (отн.ед.)
        public decimal WearFactor { get; set; }

        // Основные средства: Норма амортизации (отн.ед./год)
        public decimal AmortizationQuota { get; set; }

        // Основные средства: Коэффициент переоценки (отн.ед./год)
        public decimal OvervalueCoefficient { get; set; }

        #endregion

        #region Taxes

        // Налоги: НДС (отн.ед.)
        public decimal VAT { get; set; }

        // Налоги: С выручки (отн.ед.)
        public decimal EarningsTax { get; set; }

        // Налоги: С прибыли (отн.ед.)
        public decimal ProfitsTax { get; set; }

        // Налоги: С прибыли, остающейся в распоряжении предпрития (отн.ед.)
        public decimal RestProfitsTax { get; set; }

        // Налоги: В фонд социальной защиты (отн.ед.)
        public decimal FundTax { get; set; }

        // Налоги: С заработной платы (отн.ед.)
        public decimal WageTax { get; set; }

        // Налоги: На недвижимость (отн.ед./год)
        public decimal RealEstateTax { get; set; }

        // Налоги: Экологический (руб./ед.прод.)
        public decimal EcologicalTax { get; set; }

        // Налоги: На землю (руб./мес.)
        public decimal LandTax { get; set; }

        #endregion
    }
}
