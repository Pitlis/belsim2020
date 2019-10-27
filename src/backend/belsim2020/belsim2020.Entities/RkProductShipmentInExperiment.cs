using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace belsim2020.Entities
{
	[Table("RK_RkProductShipmentsInExperiment")]
	public class RkProductShipmentInExperiment
	{
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public Guid RkShipmentInExperimentId { get; set; }

		public Guid ProductInExperimentId { get; set; }
		public virtual RkProductInExperiment ProductInExperiment { get; set; }

		// Реализация: Объем продукции в отгрузке:(ед.)
		public double Volume { get; set; }

		// Реализация: Объем продукции в отгрузке:(мес.)
		public int ShipmentDatetime { get; set; }
	}
}
