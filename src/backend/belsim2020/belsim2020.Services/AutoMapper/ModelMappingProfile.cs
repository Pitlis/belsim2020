using AutoMapper;
using belsim2020.Entities;
using belsim2020.Services.Models;

namespace belsim2020.Services.AutoMapper
{
    public class ModelMappingProfile : Profile
    {
        public ModelMappingProfile()
        {
            DisableConstructorMapping();

            CreateMap<RkAccountInExperiment, ExperimentAccountModel>()
                .ForMember(m => m.Name, opt => opt.MapFrom(src => src.Account.Name));
            CreateMap<ExperimentAccountModel, RkAccountInExperiment>();

            CreateMap<RkProductShipmentInExperiment, ExperimentShipmentModel>();
            CreateMap<ExperimentShipmentModel, RkProductShipmentInExperiment>();

            CreateMap<RkProductResourceInExperiment, ExperimentResourceInProductModel>();
            CreateMap<ExperimentResourceInProductModel, RkProductResourceInExperiment>();

            CreateMap<RkResourceInExperiment, ExperimentResourceModel>();
            CreateMap<ExperimentResourceModel, RkResourceInExperiment>();

            CreateMap<RkProductInExperiment, ExperimentProductModel>();
            CreateMap<ExperimentProductModel, RkProductInExperiment>()
                .ForMember(m => m.Shipments, opt => opt.Ignore())
                .ForMember(m => m.Resources, opt => opt.Ignore());

            CreateMap<RkExperimentTemplate, RkExperimentTemplateModel>();
            CreateMap<RkExperimentTemplateModel, RkExperimentTemplate>()
                .ForMember(m => m.Accounts, opt => opt.Ignore())
                .ForMember(m => m.Products, opt => opt.Ignore())
                .ForMember(m => m.Resources, opt => opt.Ignore());

            CreateMap<RkExperimentTemplate, RkExperimentShortInfoModel>()
                .ForMember(m => m.OwnerName, opt => opt.MapFrom(src => src.Owner.PublicName));

            CreateMap<User, UserViewModel>();
        }
    }
}
