using System.Linq;
using AutoMapper;
using belsim2020.Entities;
using belsim2020.Services.Models;
using belsim2020.ViewModels;

namespace belsim2020.AutoMapper
{
    public class ViewModelMappingProfile : Profile
    {
        public ViewModelMappingProfile()
        {
            DisableConstructorMapping();

            CreateMap<CreateProjectViewModel, Project>();
            CreateMap<UpdateProjectViewModel, Project>();

            CreateMap<Project, ProjectInfoViewModel>();
            CreateMap<Project, ProjectInfoWithUsersViewModel>()
                .ForMember(m => m.Owners,
                    opt => opt.MapFrom(
                        src => src.Users.Where(up => up.IsProjectOwner)
                            .Select(up => new UserNameViewModel()
                            {
                                UserId = up.User.Id,
                                Name = up.User.PublicName
                            }).ToList()
                    )
                 )
                 .ForMember(m => m.AssignedUsers,
                    opt => opt.MapFrom(
                        src => src.Users.Select(up => new UserNameViewModel()
                        {
                            UserId = up.User.Id,
                            Name = up.User.PublicName
                        }).ToList()
                    )
                 );

            CreateMap<CreateResourceViewModel, RkResource>();
            CreateMap<RkResource, ResourceViewModel>();

            CreateMap<CreateProductViewModel, RkProduct>();
            CreateMap<RkProduct, ProductViewModel>();

            CreateMap<RkExperimentTemplateModel, ExperimentTemplateViewModel>();

            CreateMap<UpdateExperimentTemplateViewModel, RkExperimentTemplateModel>();

            CreateMap<RkExperimentShortInfoModel, ExperimentTemplateItemViewModel>();
        }
    }
}
