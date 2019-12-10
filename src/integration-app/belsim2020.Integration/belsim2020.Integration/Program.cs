using Autofac;
using belsim2020.Integration.Services;
using System.Net;

namespace belsim2020.Integration
{
    class Program
    {
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
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;

            CompositionRoot().Resolve<Application>().Run().Wait();
        }
    }
}
