using ClinicManager.Models.DataTransferObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ClinicManager.Controllers
{
    public class loginController : Controller
    {
        // GET: login
        public ActionResult Index()
        {
            return View();
        }

        // METHOD
        public JsonResult login(string username, string password)
        {
            return Json(AccountDTO.Instant.Login(username, password), JsonRequestBehavior.AllowGet);
        }
    }
}