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
            CreateMap<ExperimentAccountModel, RkAccountInExperiment>(); ;

            CreateMap<RkProductShipmentInExperiment, ExperimentShipmentModel>();
            CreateMap<ExperimentShipmentModel, RkProductShipmentInExperiment>();

            CreateMap<RkProductResourceInExperiment, ExperimentResourceInProductModel>();
            CreateMap<ExperimentResourceInProductModel, RkProductResourceInExperiment>();

            CreateMap<RkResourceInExperiment, ExperimentResourceModel>();
            CreateMap<ExperimentResourceModel, RkResourceInExperiment>();

            CreateMap<RkProductInExperiment, ExperimentProductModel>();
            CreateMap<ExperimentProductModel, RkProductInExperiment>();

            CreateMap<RkExperimentTemplate, RkExperimentTemplateModel>();
            CreateMap<RkExperimentTemplateModel, RkExperimentTemplate>();

            CreateMap<RkExperimentTemplate, RkExperimentShortInfoModel>()
                .ForMember(m => m.OwnerName, opt => opt.MapFrom(src => src.Owner.PublicName));
        }
    }
}
