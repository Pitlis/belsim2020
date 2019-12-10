using System;

namespace belsim2020.Integration.Models.ApiModels
{
    public class ApiExperimentShipmentModel
    {
        public Guid RkProductShipmentInExperimentId { get; set; }

        // Реализация: Объем продукции в отгрузке:(ед.)
        public double Volume { get; set; }

        // Реализация: Объем продукции в отгрузке:(мес.)
        public int ShipmentDatetime { get; set; }
    }
}
