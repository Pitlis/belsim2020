using Newtonsoft.Json.Linq;
using System;

namespace belsim2020.ViewModels
{
    public class SetExperimentResultViewModel : BaseIntegrationApiViewModel
    {
        public Guid ExperimentId { get; set; }
        public JArray ResultJson { get; set; }
    }
}
