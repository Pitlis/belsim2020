﻿using System.Linq;
using AutoMapper;
using belsim2020.Entities;
using belsim2020.Services.Models;
using belsim2020.ViewModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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
                                Name = up.User.PublicName,
                                Email = up.User.Email
                            }).ToList()
                    )
                 )
                 .ForMember(m => m.AssignedUsers,
                    opt => opt.MapFrom(
                        src => src.Users.Select(up => new UserNameViewModel()
                        {
                            UserId = up.User.Id,
                            Name = up.User.PublicName,
                            Email = up.User.Email
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

            CreateMap<ExperimentShortInfoModel, ExperimentShortInfoViewModel>();

            CreateMap<RkExperiment, ExperimentViewModel>()
                .ForMember(m => m.CreatedBy,
                    opt => opt.MapFrom(
                        src => new UserNameViewModel()
                        {
                            UserId = src.CreatedBy.Id,
                            Name = src.CreatedBy.PublicName
                        }
                    )
                 )
                 .ForMember(m => m.ExperimentTemplateName,
                    opt => opt.MapFrom(
                        src => src.ExperimentTemplate.Name
                    )
                 )
                 .ForMember(m => m.ExperimentData,
                    opt => opt.MapFrom(
                        src => JObject.Parse(src.ExperimentData)
                    )
                 )
                 .ForMember(m => m.ResultData,
                    opt => opt.MapFrom(
                        src => JArray.Parse(src.ResultData)
                    )
                 );

            CreateMap<Services.Models.UserViewModel, ViewModels.UserViewModel>();
        }
    }
}
