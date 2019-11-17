using System;

namespace belsim2020.Services.Models
{
    public class ExperimentShipmentModel
    {
        public Guid RkProductShipmentInExperimentId { get; set; }

        public Guid ProductInExperimentId { get; set; }

        // Реализация: Объем продукции в отгрузке:(ед.)
        public double Volume { get; set; }

        // Реализация: Объем продукции в отгрузке:(мес.)
        public int ShipmentDatetime { get; set; }
    }
}
