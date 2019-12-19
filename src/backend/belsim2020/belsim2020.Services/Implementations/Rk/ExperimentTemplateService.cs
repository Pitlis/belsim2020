using AutoMapper;
using belsim2020.Database;
using belsim2020.Entities;
using belsim2020.Services.Extensions;
using belsim2020.Services.Interfaces;
using belsim2020.Services.Interfaces.Rk;
using belsim2020.Services.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace belsim2020.Services.Implementations.Rk
{
    public class ExperimentTemplateService : IExperimentTemplateService
    {
        private readonly Belsim2020DbContext dbContext;
        private readonly ICurrentUserContext userContext;
        private readonly ILogger<ExperimentTemplateService> logger;
        private readonly IMapper mapper;

        public ExperimentTemplateService(
            Belsim2020DbContext dbContext,
            ICurrentUserContext userContext,
            ILogger<ExperimentTemplateService> logger,
            IMapper mapper)
        {
            this.dbContext = dbContext;
            this.userContext = userContext;
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<Guid> CreateExperimentTemplate(string name, string description, Guid projectId)
        {
            await VerifyAccessToProject(projectId);

            var accounts = await dbContext.RkAccounts.ToListAsync();

            var experimentTemplate = new RkExperimentTemplate()
            {
                Name = name,
                Description = description,
                CreatedAt = DateTime.UtcNow,
                ModifiedAt = DateTime.UtcNow,
                OwnerId = userContext.UserId,
                ProjectId = projectId,
                Accounts = accounts.Select(a => new RkAccountInExperiment() { AccountId = a.RkAccountId }).ToList()
            };

            await dbContext.AddAsync(experimentTemplate);
            await dbContext.SaveChangesAsync();

            return experimentTemplate.RkExperimentTemplateId;
        }

        public async Task UpdateExperimentTemplate(RkExperimentTemplateModel model)
        {
            var experimentTemplate = await GetExperimentTemplateFullEntity(model.RkExperimentTemplateId);

            await VerifyAccessToProject(experimentTemplate.ProjectId);
            VerifyEditAccess(experimentTemplate);
            VerifyUpdatedExperimentModel(model, experimentTemplate);

            mapper.Map(model, experimentTemplate);

            foreach (var account in model.Accounts)
            {
                var existsAccount = experimentTemplate.Accounts.First(a => a.RkAccountInExperimentId == account.RkAccountInExperimentId);
                mapper.Map(account, existsAccount);
            }

            foreach (var resource in model.Resources)
            {
                var existsResource = experimentTemplate.Resources.First(r => r.RkResourceInExperimentId == resource.RkResourceInExperimentId);
                mapper.Map(resource, existsResource);
            }

            foreach (var product in model.Products)
            {
                var existsProduct = experimentTemplate.Products.First(p => p.RkProductInExperimentId == product.RkProductInExperimentId);
                foreach (var shipment in product.Shipments)
                {
                    var existsShipment = existsProduct.Shipments.FirstOrDefault(s => s.RkProductShipmentInExperimentId == shipment.RkProductShipmentInExperimentId);
                    if (existsShipment != null)
                    {
                        mapper.Map(shipment, existsShipment);
                    }
                    else
                    {
                        var newShipment = mapper.Map<RkProductShipmentInExperiment>(shipment);
                        newShipment.ProductInExperimentId = existsProduct.RkProductInExperimentId;
                        dbContext.RkProductShipmentInExperiment.Add(newShipment);
                        existsProduct.Shipments.Add(newShipment);
                        shipment.RkProductShipmentInExperimentId = newShipment.RkProductShipmentInExperimentId;
                    }
                }
                var deletedShipmentIds = existsProduct.Shipments
                    .Select(s => s.RkProductShipmentInExperimentId)
                    .Except(product.Shipments.Select(s => s.RkProductShipmentInExperimentId));
                var deletedShipments = existsProduct.Shipments.Where(s => deletedShipmentIds.Contains(s.RkProductShipmentInExperimentId));
                dbContext.RkProductShipmentInExperiment.RemoveRange(deletedShipments);

                foreach (var resource in product.Resources)
                {
                    var existsResource = existsProduct.Resources.FirstOrDefault(r => r.RkProductResourceInExperimentId == resource.RkProductResourceInExperimentId);
                    if (existsResource != null)
                    {
                        mapper.Map(resource, existsResource);
                    }
                    else
                    {
                        var newResource = mapper.Map<RkProductResourceInExperiment>(resource);
                        newResource.RkProductInExperimentId = existsProduct.RkProductInExperimentId;
                        dbContext.RkProductResourceInExperiment.Add(newResource);
                        existsProduct.Resources.Add(newResource);
                        resource.RkProductResourceInExperimentId = newResource.RkProductResourceInExperimentId;
                    }
                    var deletedResourceIds = existsProduct.Resources
                        .Select(r => r.RkProductResourceInExperimentId)
                        .Except(product.Resources.Select(r => r.RkProductResourceInExperimentId));
                    var deletedResources = existsProduct.Resources.Where(r => deletedResourceIds.Contains(r.RkProductResourceInExperimentId));
                    dbContext.RkProductResourceInExperiment.RemoveRange(deletedResources);
                }

                mapper.Map(product, existsProduct);
            }

            experimentTemplate.ModifiedAt = DateTime.UtcNow;

            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteExperimentTemplate(Guid experimentTemplateId)
        {
            var experimentTemplate = await dbContext.RkExperimentTemplates.FirstOrDefaultAsync(t => t.RkExperimentTemplateId == experimentTemplateId);

            if (experimentTemplate == null)
            {
                throw new ApplicationException($"Template [{experimentTemplateId}] does not exists");
            }

            await VerifyAccessToProject(experimentTemplate.ProjectId);

            VerifyEditAccess(experimentTemplate);

            dbContext.RkExperimentTemplates.Remove(experimentTemplate);
            await dbContext.SaveChangesAsync();
        }

        public async Task<RkExperimentTemplateModel> GetExperimentTemplate(Guid experimentTemplateId)
        {
            var experimentTemplate = await GetExperimentTemplateFullEntity(experimentTemplateId);

            await VerifyAccessToProject(experimentTemplate.ProjectId);

            var model = mapper.Map<RkExperimentTemplateModel>(experimentTemplate);
            return model;
        }

        public async Task<List<RkExperimentShortInfoModel>> GetExperimentTemplates(Guid projectId)
        {
            await VerifyAccessToProject(projectId);

            var experimentTemplates = await dbContext.RkExperimentTemplates
                .Include(t => t.Owner)
                .Where(t => t.ProjectId == projectId)
                .ToListAsync();

            var model = new List<RkExperimentShortInfoModel>();

            foreach (var item in experimentTemplates)
            {
                model.Add(mapper.Map<RkExperimentShortInfoModel>(item));
            }

            return model;
        }

        public async Task UpdateProductList(Guid experimentTemplateId, IList<Guid> productIds)
        {
            productIds = productIds.Distinct().ToList();
            var experimentTemplate = await dbContext.RkExperimentTemplates.FirstOrDefaultAsync(t => t.RkExperimentTemplateId == experimentTemplateId);

            if (experimentTemplate == null)
            {
                throw new ApplicationException($"Template [{experimentTemplate.RkExperimentTemplateId}] does not exists");
            }

            VerifyEditAccess(experimentTemplate);

            var productsInExperiment = await dbContext.RkProductsInExperiment
                .Where(p => p.ExperimentTemplateId == experimentTemplateId)
                .ToListAsync();

            var productsForRemoving = new List<RkProductInExperiment>();
            foreach (var product in productsInExperiment)
            {
                if (!productIds.Contains(product.ProductId))
                {
                    productsForRemoving.Add(product);
                }
            }

            var availableProductIds = await dbContext.RkProducts
                .Where(p => p.ProjectId == experimentTemplate.ProjectId)
                .Select(p => p.RkProductId)
                .ToListAsync();
            foreach (var productId in productIds)
            {
                if (!availableProductIds.Contains(productId))
                {
                    throw new ApplicationException($"Project [{experimentTemplate.ProjectId}] does not contains product [{productId}]");
                }
            }

            var existsProductInExperimentIds = productsInExperiment.Select(p => p.ProductId);
            foreach (var productId in productIds)
            {
                if (!existsProductInExperimentIds.Contains(productId))
                {
                    dbContext.RkProductsInExperiment.Add(new RkProductInExperiment()
                    {
                        ProductId = productId,
                        ExperimentTemplateId = experimentTemplateId
                    });
                }
            }
            dbContext.RkProductsInExperiment.RemoveRange(productsForRemoving);

            await dbContext.SaveChangesAsync();
        }

        public async Task UpdateResourcesList(Guid experimentTemplateId, IList<Guid> resourceIds)
        {
            resourceIds = resourceIds.Distinct().ToList();
            var experimentTemplate = await dbContext.RkExperimentTemplates.FirstOrDefaultAsync(t => t.RkExperimentTemplateId == experimentTemplateId);

            if (experimentTemplate == null)
            {
                throw new ApplicationException($"Template [{experimentTemplate.RkExperimentTemplateId}] does not exists");
            }

            VerifyEditAccess(experimentTemplate);

            var resourcesInExperiment = await dbContext.RkResourcesInExperiment
                .Where(r => r.ExperimentTemplateId == experimentTemplateId)
                .ToListAsync();

            var resourcesForRemoving = new List<RkResourceInExperiment>();
            foreach (var resource in resourcesInExperiment)
            {
                if (!resourceIds.Contains(resource.ResourceId))
                {
                    resourcesForRemoving.Add(resource);
                }
            }

            var availableResourceIds = await dbContext.RkResources
                .Where(p => p.ProjectId == experimentTemplate.ProjectId)
                .Select(p => p.RkResourceId)
                .ToListAsync();
            foreach (var resourceId in resourceIds)
            {
                if (!availableResourceIds.Contains(resourceId))
                {
                    throw new ApplicationException($"Project [{experimentTemplate.ProjectId}] does not contains resource [{resourceId}]");
                }
            }

            var existsResourcesInExperimentIds = resourcesInExperiment.Select(p => p.ResourceId);
            foreach (var resourceId in resourceIds)
            {
                if (!existsResourcesInExperimentIds.Contains(resourceId))
                {
                    dbContext.RkResourcesInExperiment.Add(new RkResourceInExperiment()
                    {
                        ResourceId = resourceId,
                        ExperimentTemplateId = experimentTemplateId
                    });
                }
            }
            dbContext.RkResourcesInExperiment.RemoveRange(resourcesForRemoving);

            await dbContext.SaveChangesAsync();
        }

        #region Helpers

        private async Task VerifyAccessToProject(Guid projectId)
        {
            var project = await dbContext.Projects
                .Include(p => p.Users)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);

            if (project == null)
            {
                throw new ApplicationException($"Project [{projectId}] does not exist");
            }

            if (!project.Users.Select(u => u.UserId).Contains(userContext.UserId) && !userContext.IsAdmin())
            {
                throw new ApplicationException($"User[{userContext.UserId}] does not have access to project [{projectId}]");
            }
        }

        private void VerifyEditAccess(RkExperimentTemplate experimentTemplate)
        {
            if (experimentTemplate.OwnerId != userContext.UserId && !userContext.IsAdmin())
            {
                throw new ApplicationException($"User[{userContext.UserId}] does not have edit access to template [{experimentTemplate.RkExperimentTemplateId}]");
            }
        }

        private async Task<RkExperimentTemplate> GetExperimentTemplateFullEntity(Guid experimentTemplateId)
        {
            var experimentTemplate = await dbContext.RkExperimentTemplates
                .Include(e => e.Accounts)
                    .ThenInclude(a => a.Account)
                .Include(e => e.Products)
                    .ThenInclude(p => p.Shipments)
                .Include(e => e.Products)
                    .ThenInclude(p => p.Resources)
                .Include(e => e.Resources)
                    .ThenInclude(p => p.Resource)
                .FirstOrDefaultAsync(t => t.RkExperimentTemplateId == experimentTemplateId);

            if (experimentTemplate == null)
            {
                throw new ApplicationException($"Template [{experimentTemplateId}] does not exists");
            }

            return experimentTemplate;
        }

        private void VerifyUpdatedExperimentModel(RkExperimentTemplateModel model, RkExperimentTemplate experimentTemplate)
        {
            if (experimentTemplate.OwnerId != model.OwnerId)
            {
                throw new ApplicationException("Owner of experiment template cannot be changed");
            }

            if (experimentTemplate.CreatedAt != model.CreatedAt)
            {
                throw new ApplicationException("Creation date of experiment template cannot be changed");
            }

            foreach (var accountInModel in model.Accounts)
            {
                if (experimentTemplate.Accounts
                    .FirstOrDefault(a =>
                        a.AccountId == accountInModel.AccountId
                        && a.ExperimentTemplateId == accountInModel.ExperimentTemplateId
                        && a.RkAccountInExperimentId == accountInModel.RkAccountInExperimentId) == null)
                {
                    throw new ApplicationException($"Account list in experiment template cannot be edited");
                }
            }
            if (experimentTemplate.Accounts.Count != model.Accounts.Count)
            {
                throw new ApplicationException($"Account list in experiment template cannot be edited");
            }

            foreach (var resourceInModel in model.Resources)
            {
                if (experimentTemplate.Resources
                    .FirstOrDefault(r =>
                        r.ResourceId == resourceInModel.ResourceId
                        && r.RkResourceInExperimentId == resourceInModel.RkResourceInExperimentId
                        && r.ExperimentTemplateId == r.ExperimentTemplateId) == null)
                {
                    throw new ApplicationException($"Resource in updated model [{resourceInModel.ResourceId}] does not exists in resources list of experiment [{experimentTemplate.RkExperimentTemplateId}]");
                }
            }
            if (experimentTemplate.Resources.Count != model.Resources.Count)
            {
                throw new ApplicationException($"Resource list in experiment template cannot be edited");
            }

            foreach (var productInModel in model.Products)
            {
                if (experimentTemplate.Products
                    .FirstOrDefault(r =>
                        r.ProductId == productInModel.ProductId
                        && r.RkProductInExperimentId == productInModel.RkProductInExperimentId
                        && r.ExperimentTemplateId == r.ExperimentTemplateId) == null)
                {
                    throw new ApplicationException($"Product in updated model [{productInModel.ProductId}] does not exists in products list of experiment [{experimentTemplate.RkExperimentTemplateId}]");
                }

                foreach (var resource in productInModel.Resources)
                {
                    if (experimentTemplate.Resources.FirstOrDefault(p => p.RkResourceInExperimentId == resource.RkResourceInExperimentId) == null)
                    {
                        throw new ApplicationException($"ResourceProduct for product in experiment [{resource.RkResourceInExperimentId}] cannot be added - resource of this ResourceProduct does not exist in current experiment [{experimentTemplate.RkExperimentTemplateId}]");
                    }
                }

                var groupedResources = productInModel.Resources.GroupBy(r => r.RkResourceInExperimentId);
                foreach (var group in groupedResources)
                {
                    if (group.Count() > 1)
                    {
                        throw new ApplicationException($"ResourceProduct (resource [{group.Key}]) can be added to product only once");
                    }
                }
            }
            if (experimentTemplate.Products.Count != model.Products.Count)
            {
                throw new ApplicationException($"Product list in experiment template cannot be edited");
            }
        }

        public async Task<Guid> CreateExperiment(Guid experimentTemplateId, string name)
        {
            var templateModel = await GetExperimentTemplate(experimentTemplateId);
            var experiment = new RkExperiment()
            {
                ExperimentTemplateId = experimentTemplateId,
                CreatedAt = DateTime.UtcNow,
                CreatedById = userContext.UserId,
                ExperimentData = JsonConvert.SerializeObject(templateModel),
                Status = ExperimentStatus.Created,
                StatusChangedAt = DateTime.UtcNow,
                Name = name
            };
            await dbContext.RkExperiments.AddAsync(experiment);
            await dbContext.SaveChangesAsync();

            return experiment.RkExperimentId;
        }

        #endregion
    }
}
