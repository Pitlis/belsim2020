using belsim2020.Database;
using belsim2020.Entities;
using belsim2020.Services.Extensions;
using belsim2020.Services.Interfaces;
using belsim2020.Services.Interfaces.Rk;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace belsim2020.Services.Implementations.Rk
{
    public class ProductService : IProductService
    {
        private readonly Belsim2020DbContext dbContext;
        private readonly ICurrentUserContext userContext;
        private readonly ILogger<ProjectService> logger;

        public ProductService(
            Belsim2020DbContext dbContext,
            ICurrentUserContext userContext,
            ILogger<ProjectService> logger)
        {
            this.dbContext = dbContext;
            this.userContext = userContext;
            this.logger = logger;
        }

        public async Task CreateProduct(RkProduct product)
        {
            await VerifyProjectExists(product.ProjectId);
            await VerifyProjectAccess(product.ProjectId);

            product.NormalizedName = product.Name.ToLowerInvariant();
            var existsProduct = await dbContext.RkProducts.FirstOrDefaultAsync(r => r.NormalizedName == product.NormalizedName);
            if (existsProduct != null)
            {
                throw new ApplicationException($"Product with name [{product.Name}] already exists");
            }

            await dbContext.RkProducts.AddAsync(product);

            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteProduct(Guid productId)
        {
            await VerifyProjectAccess(productId);

            var product = await dbContext.RkProducts.FirstOrDefaultAsync(up => up.RkProductId == productId);
            if (product == null)
            {
                throw new ApplicationException($"Product [{productId}] does not exists");
            }

            var productInExperiments = await dbContext.RkProductsInExperiment.Where(r => r.ProductId == productId).ToListAsync();
            if (productInExperiments.Count > 0)
            {
                throw new ApplicationException($"Product [{productId}] cannot be removed - it is used in experiments");
            }

            dbContext.RkProducts.Remove(product);
            await dbContext.SaveChangesAsync();
        }

        public async Task<IList<RkProduct>> GetAllProducts(Guid projectId)
        {
            await VerifyProjectAccess(projectId);

            return await dbContext.RkProducts.Where(r => r.ProjectId == projectId).ToListAsync();
        }

        #region Helpers

        private async Task VerifyProjectAccess(Guid projectId)
        {
            if (!userContext.IsAdmin() && await dbContext.UserProjects.FirstOrDefaultAsync(up => up.ProjectId == projectId && up.UserId == userContext.UserId) == null)
            {
                throw new ApplicationException($"Current user [{userContext.UserId}] cannot execute this action for project [{projectId}]");
            }
        }

        private async Task VerifyProjectExists(Guid projectId)
        {
            if (await dbContext.Projects.FirstOrDefaultAsync(p => p.ProjectId == projectId) == null)
            {
                throw new ApplicationException($"Project [{projectId}] does not exists");
            }
        }

        #endregion
    }
}
