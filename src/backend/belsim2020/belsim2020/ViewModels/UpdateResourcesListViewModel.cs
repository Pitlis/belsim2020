using System;
using System.Collections.Generic;

namespace belsim2020.ViewModels
{
    public class UpdateResourcesListViewModel
    {
        public Guid ExperimentTemplateId { get; set; }
        public IList<Guid> ResourceIds { get; set; }
    }
}
