import { DistrFuncTypes } from "./RkExperimentTemplate";
import { ExperimentShipment, ExperimentResourceInProduct } from "models";

export class ExperimentProduct {
    public rkProductInExperimentId: string;

    public productId: string;
    public experimentTemplateId: string;

    public shipments: ExperimentShipment[];
    public resources: ExperimentResourceInProduct[];

    // Производство: Длительность цикла (дн.)
    public cycleTime: number;

    // Запасы: Готовая продукция (ед.)
    public finishedProductCount: number;

    // Запасы: Себестоимость готовой продукции (руб./ед.)
    public finishedProductCost: number;

    // Реализация: Объем отгрузки: Среднее (ед.)
    public shipmentVolume: number;

    // Реализация: Объем отгрузки: Стандартное отклонение (ед.)
    public shipmentVolumeStdDev: number;

    // Реализация: Объем отгрузки: Вид функции плотности распределения (0;1;2)
    public shipmentVolumeDistrFuncType: DistrFuncTypes

    // Реализация: Цены продукции (руб./ед.)
    public price: number;

    // Затраты: Прочие переменные (руб./ед.прод.)
    public variableCosts: number;

    // Затраты: Доля заработной платы в переменных затратах (отн.ед.)
    public wageShare: number;
}