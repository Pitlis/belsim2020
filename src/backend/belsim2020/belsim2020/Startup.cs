using AutoMapper;
using belsim2020.AutoMapper;
using belsim2020.Configuration;
using belsim2020.Database;
using belsim2020.Entities;
using belsim2020.Middlewares;
using belsim2020.Services;
using belsim2020.Services.AutoMapper;
using belsim2020.Services.Configuration;
using belsim2020.Services.Implementations;
using belsim2020.Services.Implementations.Rk;
using belsim2020.Services.Interfaces;
using belsim2020.Services.Interfaces.Rk;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Net;
using System.Threading.Tasks;

namespace belsim2020
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddDbContext<Belsim2020DbContext>(options =>
                options.UseNpgsql(
                    Configuration.GetConnectionString("belsimDbContextConnection")
                )
            );

            services.AddIdentity<User, IdentityRole>(opts =>
            {
                opts.Password.RequiredLength = 6;
                opts.Password.RequireNonAlphanumeric = false;
                opts.Password.RequireLowercase = false;
                opts.Password.RequireUppercase = false;
                opts.Password.RequireDigit = false;
                opts.Lockout.AllowedForNewUsers = true;
                opts.Lockout.MaxFailedAccessAttempts = 10;
                opts.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
                opts.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<Belsim2020DbContext>()
            .AddDefaultTokenProviders();

            services.ConfigureApplicationCookie(options =>
            {
                // Cookie settings
                options.ExpireTimeSpan = TimeSpan.FromMinutes(120);
                options.SlidingExpiration = true;
                options.Cookie.SameSite = SameSiteMode.None;
                //options.Cookie.Path = Configuration.GetValue<string>("FrontendHost");


                options.Events = new CookieAuthenticationEvents
                {
                    OnRedirectToLogin = ctx =>
                    {
                        if (ctx.Request.Path.StartsWithSegments("/api"))
                        {
                            ctx.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                        }
                        return Task.FromResult(0);
                    },
                    OnRedirectToAccessDenied = ctx =>
                    {
                        if (ctx.Request.Path.StartsWithSegments("/api"))
                        {
                            ctx.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                        }
                        return Task.FromResult(0);
                    }
                };
            });

            services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddCors(options =>
            {
                options.AddPolicy("default",
                builder =>
                {
                    builder.WithOrigins(Configuration.GetValue<string>("FrontendHost"));
                    builder.AllowAnyMethod();
                    builder.AllowAnyHeader();
                    builder.AllowCredentials();
                });
            });

            services.Configure<AdminSettings>(Configuration.GetSection("AdminSettings"));
            services.Configure<ExperimentorSettings>(Configuration.GetSection("ExperimentorSettings"));
            services.Configure<ExperimentSettings>(Configuration.GetSection("ExperimentSettings"));

            services.AddScoped<ICurrentUserContext, CurrentUserContext>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IProjectService, ProjectService>();
            services.AddTransient<IResourceService, ResourceService>();
            services.AddTransient<IProductService, ProductService>();
            services.AddTransient<IExperimentTemplateService, ExperimentTemplateService>();
            services.AddTransient<IExperimentService, ExperimentService>();

            services.AddAutoMapper(typeof(ViewModelMappingProfile).Assembly, typeof(ModelMappingProfile).Assembly);


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, Belsim2020DbContext dbContext)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors("default");

            app.UseMiddleware<CustomExceptionMiddleware>();
            app.UseStaticFiles();

            app.UseCookiePolicy();
            app.UseAuthentication();
            app.UseMvc();
        }
    }
}
