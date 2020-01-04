using System;

namespace belsim2020.ViewModels
{
    public class SetExperimentResultViewModel : BaseIntegrationApiViewModel
    {
        public Guid ExperimentId { get; set; }
        public string ResultJson { get; set; }
    }
}
