using System.Collections.Generic;

namespace belsim2020.Integration.Models.ResultModels
{
    public class Run
    {
        public int Index { get; set; }

        public List<Variable> Variables { get; set; }

        public Run()
        {
            Variables = new List<Variable>();
        }
    }
}
