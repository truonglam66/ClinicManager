using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace ClinicManager
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "community",
                url: "community/{action}/{id}",
                defaults: new { controller = "community", action = "patients", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "recaptionist",
                url: "receptionist/{action}/{id}",
                defaults: new { controller = "receptionist", action = "new_health_record", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "doctor",
                url: "doctor/{action}/{id}",
                defaults: new { controller = "doctor", action = "examination", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "manager",
                url: "manager/{action}/{id}",
                defaults: new { controller = "manager", action = "profile", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "home", action = "index", id = UrlParameter.Optional }
            );
        }
    }
}
