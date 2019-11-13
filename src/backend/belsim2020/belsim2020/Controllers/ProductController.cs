using AutoMapper;
using belsim2020.Entities;
using belsim2020.Services.Interfaces;
using belsim2020.Services.Interfaces.Rk;
using belsim2020.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace belsim2020.Controllers
{
    [Route("api/product")]
    [ApiController]
    [Authorize]
    public class ProductController : ControllerBase
    {
        private readonly IProductService productService;
        private readonly ICurrentUserContext userContext;
        private readonly IMapper mapper;

        public ProductController(
            IProductService productService,
            ICurrentUserContext userContext,
            IMapper mapper)
        {
            this.productService = productService;
            this.userContext = userContext;
            this.mapper = mapper;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductViewModel viewModel)
        {
            var model = mapper.Map<RkProduct>(viewModel);

            await productService.CreateProduct(model);

            return new OkResult();
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteProduct([FromBody] Guid productId)
        {
            await productService.DeleteProduct(productId);

            return new OkResult();
        }

        [HttpDelete("all")]
        public async Task<IActionResult> GetAllProducts([FromBody] Guid projectId)
        {
            var products = await productService.GetAllProducts(projectId);
            var model = mapper.Map<IList<ProductViewModel>>(products);

            return new OkObjectResult(model);
        }
    }
}