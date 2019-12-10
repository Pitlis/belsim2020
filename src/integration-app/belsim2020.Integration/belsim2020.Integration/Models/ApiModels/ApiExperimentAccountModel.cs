using System;

namespace belsim2020.Integration.Models.ApiModels
{
    public class ApiExperimentAccountModel
    {
        public Guid AccountId { get; set; }
        public Guid RkAccountInExperimentId { get; set; }
        public Guid ExperimentTemplateId { get; set; }

        public string Name { get; set; }
        public decimal Value { get; set; }
    }
}
