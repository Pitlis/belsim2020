namespace belsim2020.Integration.Models.ResultModels
{
    public struct BoxPlot
    {
        public decimal Median { get; set; }

        public decimal MinQuarter { get; set; }

        public decimal MaxQuarter { get; set; }

        public decimal Min { get; set; }

        public decimal Max { get; set; }

        public BoxPlot(decimal m, decimal lq, decimal uq, decimal le, decimal ue)
        {
            Median = m;
            MinQuarter = lq;
            MaxQuarter = uq;
            Min = le;
            Max = ue;
        }
    }
}
