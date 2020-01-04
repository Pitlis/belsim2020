using Autofac;
using belsim2020.Integration.Services;
using NLog;
using System;
using System.Net;

namespace belsim2020.Integration
{
    class Program
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        private static IContainer CompositionRoot()
        {
            var builder = new ContainerBuilder();
            builder.RegisterType<Application>();
            builder.RegisterType<ApiService>();
            builder.RegisterType<ExperimenterDataService>();
            return builder.Build();
        }

        public static void Main()  //Main entry point
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls;

            try
            {
                logger.Info("Run app");
                CompositionRoot().Resolve<Application>().Run();
            }
            catch (Exception ex)
            {
                logger.Error(ex);
            }
        }
    }
}
