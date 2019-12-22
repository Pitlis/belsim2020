using belsim2020.Integration.Models;
using belsim2020.Integration.Models.ApiModels;
using belsim2020.Integration.Models.ResultModels;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Xml;
using System.Xml.Linq;

namespace belsim2020.Integration.Services
{
    public class ExperimenterDataService
    {
        private static readonly string VARIABLE = "variable";
        private static readonly string VALUE = "value";
        private static readonly string INDEX = "index";
        private static readonly string NAME = "name";
        private static readonly string TYPE = "type";
        private static readonly string VARIABLE_ARRAY = "variable-array";

        public void WriteModelDataToFile(string fileName, ApiExperimentModel model)
        {
            XDocument doc = new XDocument(new XDeclaration("1.0", "windows-1251", "yes"));
            XElement xml = new XElement(
                "model",
                new XAttribute("name", "Имитационная модель промышленного предприятия. Работа с контрактами."),
                new XAttribute("version", "1.4"),
                new XAttribute("revision", "2005.01.29"),
                new XAttribute("copyright", "Авторские права (С) 2002-2005 Сергей А. Альховик и др."));
            doc.Add(xml);

            xml.Add(GetModelParametersAsXml(model));
            xml.Add(GetResponsesAsXml());

            doc.Save(fileName);
        }

        public void WriteExperimentScenarioToFile(string fileName, ApiExperimentModel model)
        {
            XDocument doc = new XDocument(new XDeclaration("1.0", "windows-1251", "yes"));
            XElement experiment = new XElement("experiment", new XAttribute(TYPE, "FullFactorial"));
            doc.Add(experiment);

            XElement experimentParameters = new XElement("experiment-parameters");
            experiment.Add(experimentParameters);

            experimentParameters.Add(GetModelParametersAsXml(model));
            experimentParameters.Add(GetResponsesAsXml());
            experimentParameters.Add(new XElement("number-of-replicate-runs", model.CountRuns));

            XElement experimentResults = new XElement("experiment-results");
            experiment.Add(experimentResults);

            doc.Save(fileName);
        }

        public List<Run> GetResultsFromFile(string fileName)
        {
            List<Run> runs = new List<Run>();

            FileStream fs = new FileStream(fileName, FileMode.Open, FileAccess.Read);
            XmlTextReader reader = new XmlTextReader(fs);

            try
            {
                bool resultsFindFlag = false;
                while (reader.Read())
                {
                    if (reader.NodeType == XmlNodeType.Element && reader.Name == "experiment-results")
                    {
                        resultsFindFlag = true;
                        break;
                    }
                }

                if (resultsFindFlag)
                    while (reader.Read())
                        if (reader.NodeType == XmlNodeType.Element && reader.Name == "responses")
                        {
                            runs.Add(new Run() { Index = Convert.ToInt32(reader.GetAttribute("run")) });
                            while (reader.Read())
                            {
                                if (reader.NodeType == XmlNodeType.EndElement && reader.Name == "responses")
                                    break;

                                if (reader.NodeType == XmlNodeType.Element && reader.Name == "variable")
                                {
                                    Variable variable = new Variable() { Name = reader.GetAttribute("name") };
                                    while (reader.Read())
                                    {
                                        if (reader.NodeType == XmlNodeType.EndElement && reader.Name == "variable")
                                            break;

                                        if (reader.NodeType == XmlNodeType.Element && reader.Name == "value")
                                        {
                                            reader.Read();
                                            variable.Value = decimal.Parse(reader.Value, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture);
                                        }

                                        if (reader.NodeType == XmlNodeType.Element && reader.Name == "timed-value")
                                        {
                                            decimal time = Convert.ToDecimal(reader.GetAttribute("time"));
                                            reader.Read();
                                            variable.TimedValues.Add(new TimedValue()
                                            {
                                                Time = time,
                                                Value = decimal.Parse(reader.Value, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture)
                                            });
                                        }
                                    }
                                    runs.Last().Variables.Add(variable);
                                }
                            }
                        }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                fs.Close();
            }

            //if (runs == null || runs.Count == 0)
            //    return null;

            //string[] variableNames = runs[0].Variables.Select(o => o.Name).ToArray();
            //List<Variable> variables = new List<Variable>();
            //foreach (var variableName in variableNames)
            //{
            //    int n = runs[0].Variables.FirstOrDefault(o => o.Name == variableName).TimedValues.Count + 1;
            //    int m = runs.Count;
            //    decimal[,] vTable = new decimal[n, m];
            //    for (int i = 0; i < runs.Count; i++)
            //    {
            //        Variable variable = runs[i].Variables.FirstOrDefault(o => o.Name == variableName);
            //        vTable[0, i] = variable.Value;
            //        for (int j = 0; j < variable.TimedValues.Count; j++)
            //            vTable[j + 1, i] = variable.TimedValues[j].Value;
            //    }

            //    Variable v = new Variable()
            //    {
            //        Name = variableName
            //    };

            //    for (int i = 0; i < n; i++)
            //    {
            //        List<decimal> timedValues = new List<decimal>();
            //        for (int j = 0; j < m; j++)
            //            timedValues.Add(vTable[i, j]);

            //        decimal median = timedValues.Average();

            //        var lqValues = timedValues.Where(o => o < median);
            //        decimal lq = median;
            //        if (lqValues != null && lqValues.Count() > 0)
            //            lq = lqValues.Average();

            //        var uqValues = timedValues.Where(o => o > median);
            //        decimal uq = median;
            //        if (uqValues != null && uqValues.Count() > 0)
            //            uq = uqValues.Average();

            //        decimal le = timedValues.Min();
            //        decimal ue = timedValues.Max();

            //        if (i == 0)
            //            v.BoxPlotParameters = new BoxPlot(median, lq, uq, le, ue);
            //        else
            //            v.TimedValues.Add(new TimedValue()
            //            {
            //                Time = runs[0].Variables.FirstOrDefault(o => o.Name == variableName).TimedValues[i - 1].Time,
            //                BoxPlotParameters = new BoxPlot(median, lq, uq, le, ue)
            //            });
            //    }

            //    variables.Add(v);
            //}

            return runs;
        }

        #region Xml parameters

        private XElement GetModelParametersAsXml(ApiExperimentModel experiment)
        {
            XElement parameters = new XElement("parameters");

            XElement variable = new XElement(VARIABLE, new XAttribute(NAME, "__Период времени (мес.)"));
            variable.Add(new XElement(VALUE, experiment.Period));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "__Интервал сбора статистики (мес.)"));
            variable.Add(new XElement(VALUE, experiment.Interval));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "_Количество видов продукции (ед.)"));
            variable.Add(new XElement(VALUE, experiment.Products.Count));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "_Количество видов ресурсов (ед.)"));
            variable.Add(new XElement(VALUE, experiment.Resources.Count));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "План-график производства: Интервал планирования (дн.)"));
            variable.Add(new XElement(VALUE, experiment.PlanningInterval));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "План-график производства: Количество интервалов планирования (ед.)"));
            variable.Add(new XElement(VALUE, experiment.PlanningIntervalsCount));
            parameters.Add(variable);

            variable = new XElement(VARIABLE_ARRAY, new XAttribute(NAME, "Производство: Длительность цикла (дн.)"));
            for (int i = 0; i < experiment.Products.Count; i++)
            {
                XElement item = new XElement(VARIABLE, new XAttribute(INDEX, i));
                item.Add(new XElement(VALUE, experiment.Products[i].CycleTime));
                variable.Add(item);
            }
            parameters.Add(variable);

            variable = new XElement(VARIABLE_ARRAY, new XAttribute(NAME, "Производство: Расход ресурсов (ед.рес./ед.прод.)"));
            for (int i = 0; i < experiment.Products.Count; i++)
                for (int j = 0; j < experiment.Products[i].Resources.Count; j++)
                {
                    XElement item = new XElement(VARIABLE, new XAttribute(INDEX, string.Format("{0},{1}", i, j)));
                    item.Add(new XElement(VALUE, experiment.Products[i].Resources[j].ResourceConsumption.ToString(CultureInfo.InvariantCulture)));
                    variable.Add(item);
                }
            parameters.Add(variable);

            variable = new XElement(VARIABLE_ARRAY, new XAttribute(NAME, "Запасы: Готовая продукция (ед.)"));
            for (int i = 0; i < experiment.Products.Count; i++)
            {
                XElement item = new XElement(VARIABLE, new XAttribute(INDEX, i));
                item.Add(new XElement(VALUE, (int)experiment.Products[i].FinishedProductCount));
                variable.Add(item);
            }
            parameters.Add(variable);

            variable = new XElement(VARIABLE_ARRAY, new XAttribute(NAME, "Запасы: Себестоимость готовой продукции (руб./ед.)"));
            for (int i = 0; i < experiment.Products.Count; i++)
            {
                XElement item = new XElement(VARIABLE, new XAttribute(INDEX, i));
                item.Add(new XElement(VALUE, experiment.Products[i].FinishedProductCost.ToString(CultureInfo.InvariantCulture)));
                variable.Add(item);
            }
            parameters.Add(variable);

            variable = new XElement(VARIABLE_ARRAY, new XAttribute(NAME, "Запасы: Материальные ресурсы (ед.)"));
            for (int i = 0; i < experiment.Resources.Count; i++)
            {
                XElement item = new XElement(VARIABLE, new XAttribute(INDEX, i));
                item.Add(new XElement(VALUE, experiment.Resources[i].StoredResourcesCount));
                variable.Add(item);
            }
            parameters.Add(variable);

            variable = new XElement(VARIABLE_ARRAY, new XAttribute(NAME, "Запасы: Цена материальных ресурсов (руб./ед.)"));
            for (int i = 0; i < experiment.Resources.Count; i++)
            {
                XElement item = new XElement(VARIABLE, new XAttribute(INDEX, i));
                item.Add(new XElement(VALUE, experiment.Resources[i].StoredResourcePrice.ToString(CultureInfo.InvariantCulture)));
                variable.Add(item);
            }
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Реализация: Количество отгрузок: (ед.)"));
            variable.Add(new XElement(VALUE, experiment.ShipmentsCount));
            parameters.Add(variable);

            foreach (var product in experiment.Products)
            {
                product.Shipments = product.Shipments.OrderBy(s => s.ShipmentDatetime).ToList();
            }

            variable = new XElement(VARIABLE_ARRAY, new XAttribute(NAME, "Реализация: Время отгрузки: (мес.)"));
            var countShipmentsForProducts = experiment.Products.First().Shipments.Count;
            for (int i = 0; i < countShipmentsForProducts; i++)
            {
                XElement item = new XElement(VARIABLE, new XAttribute(INDEX, i));
                item.Add(new XElement(VALUE, experiment.Products.First().Shipments[i].ShipmentDatetime));
                variable.Add(item);
            }
            parameters.Add(variable);

            variable = new XElement(VARIABLE_ARRAY, new XAttribute(NAME, "Реализация: Объем продукции в отгрузке:(ед.)"));
            for (int productIndex = 0; productIndex < experiment.Products.Count; productIndex++)
                for (int shipmentIndex = 0; shipmentIndex < countShipmentsForProducts; shipmentIndex++)
                {
                    XElement item = new XElement(VARIABLE, new XAttribute(INDEX, string.Format("{0},{1}", shipmentIndex, productIndex)));
                    item.Add(new XElement(VALUE, experiment.Products[productIndex].Shipments[shipmentIndex].Volume.ToString(CultureInfo.InvariantCulture)));
                    variable.Add(item);
                }
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Реализация: Интервал между отгрузками: Среднее (дн.)"));
            variable.Add(new XElement(VALUE, experiment.ShippingCycle));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Реализация: Интервал между отгрузками: Стандартное отклонение (дн.)"));
            variable.Add(new XElement(VALUE, experiment.ShippingCycleStdDev));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Реализация: Интервал между отгрузками: Вид функции плотности распределения (0;1;2)"));
            variable.Add(new XElement(VALUE, (int)experiment.ShippingCycleDistrFuncType));
            parameters.Add(variable);

            variable = new XElement(VARIABLE_ARRAY, new XAttribute(NAME, "Реализация: Объем отгрузки: Среднее (ед.)"));
            for (int i = 0; i < experiment.Products.Count; i++)
            {
                XElement item = new XElement(VARIABLE, new XAttribute(INDEX, i));
                item.Add(new XElement(VALUE, experiment.Products[i].ShipmentVolume.ToString(CultureInfo.InvariantCulture)));
                variable.Add(item);
            }
            parameters.Add(variable);

            variable = new XElement(VARIABLE_ARRAY, new XAttribute(NAME, "Реализация: Объем отгрузки: Стандартное отклонение (ед.)"));
            for (int i = 0; i < experiment.Products.Count; i++)
            {
                XElement item = new XElement(VARIABLE, new XAttribute(INDEX, i));
                item.Add(new XElement(VALUE, experiment.Products[i].ShipmentVolumeStdDev.ToString(CultureInfo.InvariantCulture)));
                variable.Add(item);
            }
            parameters.Add(variable);

            variable = new XElement(VARIABLE_ARRAY, new XAttribute(NAME, "Реализация: Объем отгрузки: Вид функции плотности распределения (0;1;2)"));
            for (int i = 0; i < experiment.Products.Count; i++)
            {
                XElement item = new XElement(VARIABLE, new XAttribute(INDEX, i));
                item.Add(new XElement(VALUE, (int)experiment.Products[i].ShipmentVolumeDistrFuncType));
                variable.Add(item);
            }
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Реализация: Срок платежа: Среднее (дн.)"));
            variable.Add(new XElement(VALUE, experiment.PaymentDate));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Реализация: Срок платежа: Стандартное отклонение (дн.)"));
            variable.Add(new XElement(VALUE, experiment.PaymentDateStdDev));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Реализация: Срок платежа: Вид фукнции плотности распределения (0;1;2)"));
            variable.Add(new XElement(VALUE, (int)experiment.PaymentDateDistrFuncType));
            parameters.Add(variable);

            variable = new XElement(VARIABLE_ARRAY, new XAttribute(NAME, "Реализация: Цены продукции (руб./ед.)"));
            for (int i = 0; i < experiment.Products.Count; i++)
            {
                XElement item = new XElement(VARIABLE, new XAttribute(INDEX, i));
                item.Add(new XElement(VALUE, experiment.Products[i].Price.ToString(CultureInfo.InvariantCulture)));
                variable.Add(item);
            }
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Реализация: Коэффициент изменения цен (отн.ед./мес.)"));
            variable.Add(new XElement(VALUE, experiment.PriceChangeCoefficient.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Реализация: Коэффициент изменения цен: Стандартное отклонение (отн.ед.)"));
            variable.Add(new XElement(VALUE, experiment.PriceChangeCoefficientStdDev.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Реализация: Коэффициент изменения цен: Вид функции плотности распределения (0;1;2)"));
            variable.Add(new XElement(VALUE, (int)experiment.PriceChangeCoefficientDistrFuncType));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Реализация: Интервал между изменениями цен: Среднее (дн.)"));
            variable.Add(new XElement(VALUE, experiment.PriceChangeInterval));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Реализация: Интервал между изменениями цен: Стандартное отклонение (дн.)"));
            variable.Add(new XElement(VALUE, experiment.PriceChangeIntervalStdDev));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Реализация: Интервал между изменениями цен: Вид функции плотности распределения (0;1;2)"));
            variable.Add(new XElement(VALUE, (int)experiment.PriceChangeIntervalDistrFuncType));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Снабжение: Срок платежа: Среднее (дн.)"));
            variable.Add(new XElement(VALUE, experiment.SupplyPaymentDate));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Снабжение: Срок платежа: Стандартное отклонение (дн.)"));
            variable.Add(new XElement(VALUE, experiment.SupplyPaymentDateStdDev));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Снабжение: Срок платежа: Вид фукнции плотности распределения (0;1;2)"));
            variable.Add(new XElement(VALUE, (int)experiment.SupplyPaymentDateDistrFuncType));
            parameters.Add(variable);

            variable = new XElement(VARIABLE_ARRAY, new XAttribute(NAME, "Снабжение: Цены ресурсов (руб./ед.)"));
            for (int i = 0; i < experiment.Resources.Count; i++)
            {
                XElement item = new XElement(VARIABLE, new XAttribute(INDEX, i));
                item.Add(new XElement(VALUE, experiment.Resources[i].Price.ToString(CultureInfo.InvariantCulture)));
                variable.Add(item);
            }
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Снабжение: Коэффициент изменения цен (отн.ед./мес.)"));
            variable.Add(new XElement(VALUE, experiment.SupplyPriceChangeCoefficient.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Снабжение: Коэффициент изменения цен: Стандартное отклонение (отн.ед.)"));
            variable.Add(new XElement(VALUE, experiment.SupplyPriceChangeCoefficientStdDev.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Снабжение: Коэффициент изменения цен: Вид функции плотности распределения (0;1;2)"));
            variable.Add(new XElement(VALUE, (int)experiment.SupplyPriceChangeCoefficientDistrFuncType));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Снабжение: Интервал между изменениями цен: Среднее (дн.)"));
            variable.Add(new XElement(VALUE, experiment.SupplyPriceChangeInterval));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Снабжение: Интервал между изменениями цен: Стандартное отклонение (дн.)"));
            variable.Add(new XElement(VALUE, experiment.SupplyPriceChangeIntervalStdDev.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Снабжение: Интервал между изменениями цен: Вид функции плотности распределения (0;1;2)"));
            variable.Add(new XElement(VALUE, (int)experiment.SupplyPriceChangeIntervalDistrFuncType));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Финансы: Сумма на расчетном счету (руб.)"));
            variable.Add(new XElement(VALUE, experiment.SettlementAccountVolume.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Кредит: Использование для покрытия нехватки денежных средств (0;1)"));
            variable.Add(new XElement(VALUE, experiment.IsCreditUsed ? 1 : 0));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Кредит: Процентная ставка (отн.ед./год)"));
            variable.Add(new XElement(VALUE, experiment.InterestRate.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Кредит: Интервал между обращениями (дн.)"));
            variable.Add(new XElement(VALUE, experiment.CreditInterval));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Кредит: Срок (дн.)"));
            variable.Add(new XElement(VALUE, experiment.CreditCycle));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Кредит: Коэффициент покрытия нехватки денежных средств (отн.ед.)"));
            variable.Add(new XElement(VALUE, experiment.LiquidityRatio.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Затраты: Постоянные (руб./мес.)"));
            variable.Add(new XElement(VALUE, experiment.FixedCosts.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Затраты: Доля заработной платы в постоянных затратах (отн.ед.)"));
            variable.Add(new XElement(VALUE, experiment.WageShare.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE_ARRAY, new XAttribute(NAME, "Затраты: Прочие переменные (руб./ед.прод.)"));
            for (int i = 0; i < experiment.Products.Count; i++)
            {
                XElement item = new XElement(VARIABLE, new XAttribute(INDEX, i));
                item.Add(new XElement(VALUE, experiment.Products[i].VariableCosts.ToString(CultureInfo.InvariantCulture)));
                variable.Add(item);
            }
            parameters.Add(variable);

            variable = new XElement(VARIABLE_ARRAY, new XAttribute(NAME, "Затраты: Доля заработной платы в переменных затратах (отн.ед.)"));
            for (int i = 0; i < experiment.Products.Count; i++)
            {
                XElement item = new XElement(VARIABLE, new XAttribute(INDEX, i));
                item.Add(new XElement(VALUE, experiment.Products[i].WageShare.ToString(CultureInfo.InvariantCulture)));
                variable.Add(item);
            }
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Затраты: Коэффициент изменения (отн.ед./мес.)"));
            variable.Add(new XElement(VALUE, experiment.CostsChangeCoefficient.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Затраты: Коэффициент изменения: Стандартное отклонение (отн.ед.)"));
            variable.Add(new XElement(VALUE, experiment.CostsChangeStdDev.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Затраты: Коэффициент изменения: Вид функции плотности распределения (0;1;2)"));
            variable.Add(new XElement(VALUE, (int)experiment.CostsChangeDistrFuncType));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Затраты: Интервал между изменениями: Среднее (дн.)"));
            variable.Add(new XElement(VALUE, experiment.CostsChangeInterval));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Затраты: Интервал между изменениями: Стандартное отклонение (дн.)"));
            variable.Add(new XElement(VALUE, experiment.CostsChangeIntervalStdDev));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Затраты: Интервал между изменениями: Вид функции плотности распределения (0;1;2)"));
            variable.Add(new XElement(VALUE, (int)experiment.CostsChangeIntervalDistrFuncType));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Основные средства: Восстановительная стоимость (руб.)"));
            variable.Add(new XElement(VALUE, experiment.ReplacementCost.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Основные средства: Коэффициент износа (отн.ед.)"));
            variable.Add(new XElement(VALUE, experiment.WearFactor.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Основные средства: Норма амортизации (отн.ед./год)"));
            variable.Add(new XElement(VALUE, experiment.AmortizationQuota.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Основные средства: Коэффициент переоценки (отн.ед./год)"));
            variable.Add(new XElement(VALUE, experiment.OvervalueCoefficient.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Налоги: НДС (отн.ед.)"));
            variable.Add(new XElement(VALUE, experiment.VAT.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Налоги: С выручки (отн.ед.)"));
            variable.Add(new XElement(VALUE, experiment.EarningsTax.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Налоги: С прибыли (отн.ед.)"));
            variable.Add(new XElement(VALUE, experiment.ProfitsTax.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Налоги: С прибыли, остающейся в распоряжении предпрития (отн.ед.)"));
            variable.Add(new XElement(VALUE, experiment.RestProfitsTax.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Налоги: В фонд социальной защиты (отн.ед.)"));
            variable.Add(new XElement(VALUE, experiment.FundTax.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Налоги: С заработной платы (отн.ед.)"));
            variable.Add(new XElement(VALUE, experiment.WageTax.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Налоги: На недвижимость (отн.ед./год)"));
            variable.Add(new XElement(VALUE, experiment.RealEstateTax.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Налоги: Экологический (руб./ед.прод.)"));
            variable.Add(new XElement(VALUE, experiment.EcologicalTax.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            variable = new XElement(VARIABLE, new XAttribute(NAME, "Налоги: На землю (руб./мес.)"));
            variable.Add(new XElement(VALUE, experiment.LandTax.ToString(CultureInfo.InvariantCulture)));
            parameters.Add(variable);

            for (int i = 0; i < experiment.Accounts.Count; i++)
            {
                variable = new XElement(VARIABLE, new XAttribute(NAME, experiment.Accounts[i].Name));
                variable.Add(new XElement(VALUE, experiment.Accounts[i].Value.ToString(CultureInfo.InvariantCulture)));
                parameters.Add(variable);

                //-----------------------
                //What the fuck???
                //If remove account duplicate - system runs only one experiment, so, I cannot calculate BoxPlot values
                if (experiment.Accounts[i].Name == "_Счёт 84: Начальное значение(отн.ед.)")
                {
                    variable = new XElement(VARIABLE, new XAttribute(NAME, experiment.Accounts[i].Name));
                    variable.Add(new XElement(VALUE, experiment.Accounts[i].Value.ToString(CultureInfo.InvariantCulture)));
                    parameters.Add(variable);
                }
                //-----------------------

            }

            return parameters;
        }

        private XElement GetResponsesAsXml()
        {
            var responses = new List<ResponseModel>()
                {
                    new ResponseModel() { Name = "_Баланс 110: Основные средства" },
                    new ResponseModel() { Name = "_Баланс 120: Нематериальные активы" },
                    new ResponseModel() { Name = "_Баланс 130: Доходные вложения в материальные ценности" },
                    new ResponseModel() { Name = "_Баланс 140: Вложения во внеоборотные активы" },
                    new ResponseModel() { Name = "_Баланс 150: Прочие внеоборотные активы" },
                    new ResponseModel() { Name = "_Баланс 190: ИТОГО ВНЕОБОРОТНЫЕ АКТИВЫ" },
                    new ResponseModel() { Name = "_Баланс 210: Запасы" },
                    new ResponseModel() { Name = "_Баланс 211: сырье, материалы и другие аналогичные ценности" },
                    new ResponseModel() { Name = "_Баланс 212: животные на выращивании и откорме" },
                    new ResponseModel() { Name = "_Баланс 213: Незавершенное производство (издержки обращения)" },
                    new ResponseModel() { Name = "_Баланс 220: Налоги по приобретенным ценностям" },
                    new ResponseModel() { Name = "_Баланс 230: Готовая продукция и товары" },
                    new ResponseModel() { Name = "_Баланс 240: Товары отгруженные, выполненные работы, оказанные услуги" },
                    new ResponseModel() { Name = "_Баланс 251: Дебиторская задолженность расчеты с покупателями и заказчиками" },
                    new ResponseModel() { Name = "_Баланс 252: Расчеты с учредителями по вкладам в уставный фонд" },
                    new ResponseModel() { Name = "_Баланс 253: Дебиторская задолженность расчеты с разными дебиторами и кредиторами" },
                    new ResponseModel() { Name = "_Баланс 260: Краткосрочне финансовые вложения" },
                    new ResponseModel() { Name = "_Баланс 270: Денежные средства" },
                    new ResponseModel() { Name = "_Баланс 280: Прочие оборотные активы" },
                    new ResponseModel() { Name = "_Баланс 290: ИТОГО ОБОРОТНЫЕ АКТИВЫ" },
                    new ResponseModel() { Name = "_Баланс 299: Баланс АКТИВОВ" },
                    new ResponseModel() { Name = "_Баланс 510: Уставный фонд (капитал)" },
                    new ResponseModel() { Name = "_Баланс 520: Резервный фонд" },
                    new ResponseModel() { Name = "_Баланс 530: Добавочный фонд" },
                    new ResponseModel() { Name = "_Баланс 540: Нераспределенная прибыль" },
                    new ResponseModel() { Name = "_Баланс 550: Непокрытый убыток" },
                    new ResponseModel() { Name = "_Баланс 560: Целевое финансирование" },
                    new ResponseModel() { Name = "_Баланс 590: ИТОГО СОБСТВЕННЫЙ КАПИТАЛ" },
                    new ResponseModel() { Name = "_Баланс 610: Резервы предстоящих расходов" },
                    new ResponseModel() { Name = "_Баланс 620: Расходы будущих периодов" },
                    new ResponseModel() { Name = "_Баланс 630: Доходы будущих периодов" },
                    new ResponseModel() { Name = "_Баланс 640: Прибыль отчетного года" },
                    new ResponseModel() { Name = "_Баланс 650: Убыток отчетного года" },
                    new ResponseModel() { Name = "_Баланс 690: ИТОГО ДОЛГОСРОЧНЫЕ ОБЯЗАТЕЛЬСТВА" },
                    new ResponseModel() { Name = "_Баланс 710: Краткосрочные кредиты и займы" },
                    new ResponseModel() { Name = "_Баланс 720: Долгосрочные кредиты и займы" },
                    new ResponseModel() { Name = "_Баланс 731: Кредиторская задолженность, поставщики и подрядчики" },
                    new ResponseModel() { Name = "_Баланс 732: Кредиторская задолженность, расчеты по оплате труда" },
                    new ResponseModel() { Name = "_Баланс 733: Кредиторская задолженность, расчеты по прочим операциям с персоналом" },
                    new ResponseModel() { Name = "_Баланс 734: Кредиторская задолженность, расчеты по налогам и сборам" },
                    new ResponseModel() { Name = "_Баланс 735: Кредиторская задолженность, по социальному страхованию и обеспечению" },
                    new ResponseModel() { Name = "_Баланс 736: Кредиторская задолженность, расчеты с акционерами (учредителями) по выплате доходов (дивидендов)" },
                    new ResponseModel() { Name = "_Баланс 737: Кредиторская задолженность, расчеты с разными дебиторами и кредиторами" },
                    new ResponseModel() { Name = "_Баланс 790: ИТОГО Кредиторская задолженность" },
                    new ResponseModel() { Name = "_Баланс 890: Баланс ПАССИВОВ" },
                    new ResponseModel() { Name = "_Отчет о прибылях и убытках: Выручка (за минусом налогов)" },
                    new ResponseModel() { Name = "_Отчет о прибылях и убытках: Себестоимость" },
                    new ResponseModel() { Name = "_Отчет о прибылях и убытках: Прибыль от реализации" },
                    new ResponseModel() { Name = "_Отчет о прибылях и убытках: Налог на прибыль и иные обязательные платежи" },
                    new ResponseModel() { Name = "_Отчет о прибылях и убытках: Использовано прибыли" },
                    new ResponseModel() { Name = "_Отчет о прибылях и убытках: Нераспределенная прибыль" },
                    new ResponseModel() { Name = "Финансовое состояние: Коэффициент текущей ликвидности" },
                    new ResponseModel() { Name = "Финансовое состояние: Коэффициент обеспеченности собственными средствами" },
                    new ResponseModel() { Name = "Финансовое состояние: Коэффициент обеспеченности финансовых обязательств активами" },
                    new ResponseModel() { Name = "Финансовая устойчивость: Коэффициент собственности" },
                    new ResponseModel() { Name = "Финансовая устойчивость: Коэффициент абсолютной ликвидности" },
                    new ResponseModel() { Name = "Финансовая устойчивость: Коэффициент критической (быстрой) ликвидности" },
                    new ResponseModel() { Name = "Рентабельность: Рентабельность продукции по затратам" },
                    new ResponseModel() { Name = "Рентабельность: Рентабельность активов предприятия" },
                    new ResponseModel() { Name = "Рентабельность: Рентабельность основного капитала" },
                    new ResponseModel() { Name = "Рентабельность: Рентабельность собственного капитала" },
                    new ResponseModel() { Name = "Эффективность фондов: Период окупаемости собственного капитала" }
            };

            XElement responsesXml = new XElement("responses");

            for (int i = 0; i < responses.Count; i++)
            {
                XElement variable = new XElement(VARIABLE, new XAttribute(NAME, responses[i].Name));
                responsesXml.Add(variable);
            }

            return responsesXml;
        }

        #endregion
    }
}
