using System.Collections.Generic;

namespace belsim2020.Integration.Models.ResultModels
{
    public class Variable
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Value { get; set; }
        public List<TimedValue> TimedValues { get; set; }

        public Variable()
        {
            TimedValues = new List<TimedValue>();
        }

        public BoxPlot BoxPlotParameters { get; set; }
    }
}
