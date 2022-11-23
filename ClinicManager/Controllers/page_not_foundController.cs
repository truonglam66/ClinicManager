using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ClinicManager.Controllers
{
    public class page_not_foundController : Controller
    {
        // GET: page_not_found
        public ActionResult Index()
        {
            return View();
        }
    }
}