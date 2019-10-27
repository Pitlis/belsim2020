using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace belsim2020.Entities
{
	[Table("RK_ProductsInExperiment")]
	public class RkProductInExperiment
	{
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public Guid RkProductInExperimentId { get; set; }

		public Guid ProductId { get; set; }
		public virtual RkProduct Product { get; set; }

		public Guid ExperimentTemplateId { get; set; }
		public virtual RkExperimentTemplate ExperimentTemplate { get; set; }

		public virtual ICollection<RkProductShipmentInExperiment> Shipments { get; set; }
		public virtual ICollection<RkProductResourceInExperiment> Resources { get; set; }

		// Производство: Длительность цикла (дн.)
		public int CycleTime { get; set; }

		// Запасы: Готовая продукция (ед.)
		public decimal FinishedProductCount { get; set; }

		// Запасы: Себестоимость готовой продукции (руб./ед.)
		public decimal FinishedProductCost { get; set; }

		// Реализация: Объем отгрузки: Среднее (ед.)
		public decimal ShipmentVolume { get; set; }

		// Реализация: Объем отгрузки: Стандартное отклонение (ед.)
		public decimal ShipmentVolumeStdDev { get; set; }

		// Реализация: Объем отгрузки: Вид функции плотности распределения (0;1;2)
		public DistrFuncTypes ShipmentVolumeDistrFuncType { get; set; }

		// Реализация: Цены продукции (руб./ед.)
		public decimal Price { get; set; }

		// Затраты: Прочие переменные (руб./ед.прод.)
		public decimal VariableCosts { get; set; }

		// Затраты: Доля заработной платы в переменных затратах (отн.ед.)
		public decimal WageShare { get; set; }
	}
}
