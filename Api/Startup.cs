// Decompiled with JetBrains decompiler
// Type: Pushers.Startup
// Assembly: Pushers, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 5B3DEC07-3609-4CA7-A4E8-1B273E5DEB0D
// Assembly location: C:\Users\M.Amin\Desktop\Projects\Pushers\Pushers.dll

using Api.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration) => this.Configuration = configuration;

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>((Action<CookiePolicyOptions>)(options =>
            {
                options.CheckConsentNeeded = (Func<HttpContext, bool>)(context => true);
                options.MinimumSameSitePolicy = SameSiteMode.None;
            }));
            services.AddSignalR();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }
            app.UseSignalR((Action<HubRouteBuilder>)(routes => routes.MapHub<chatHub>((PathString)"/chat")));
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCookiePolicy();
            app.UseMvc();
        }
    }
}
