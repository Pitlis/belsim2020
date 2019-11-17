using System;
using System.Collections.Generic;

namespace belsim2020.ViewModels
{
    public class UpdateProductsListViewModel
    {
        public Guid ExperimentTemplateId { get; set; }
        public IList<Guid> ProductIds { get; set; }
    }
}
