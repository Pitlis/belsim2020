using belsim2020.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace belsim2020.Services.Interfaces.Rk
{
    public interface IProductService
    {
        Task CreateProduct(RkProduct product);
        Task DeleteProduct(Guid productId);
        Task<IList<RkProduct>> GetAllProducts(Guid projectId);
    }
}
