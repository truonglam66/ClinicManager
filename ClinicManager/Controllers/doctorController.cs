using ClinicManager.Models;
using ClinicManager.Models.DataTransferObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;

namespace ClinicManager.Controllers
{
    public class doctorController : Controller
    {
        // GET: doctor
        public ActionResult examination()
        {
            return View();
        }

        // METHOD

        public JsonResult setHealthRecord(HealthRecord data)
        {
            if (HttpContext.Request.HttpMethod == HttpMethod.Get.Method)
            {
                Response.Redirect("/page_not_found");
                return Json("Deny Get Request", JsonRequestBehavior.AllowGet);
            }
            else
                return Json(HealthRecordDTO.Instant.SetHealthRecord(data), JsonRequestBehavior.AllowGet);
        }

        public JsonResult createReExamination(ReExamination data)
        {
            if (HttpContext.Request.HttpMethod == HttpMethod.Get.Method)
            {
                Response.Redirect("/page_not_found");
                return Json("Deny Get Request", JsonRequestBehavior.AllowGet);
            }
            else
                return Json(ReExaminationDTO.Instant.CreateReExamination(data), JsonRequestBehavior.AllowGet);
        }

        public JsonResult createPrescription(List<Prescription> data)
        {
            if (HttpContext.Request.HttpMethod == HttpMethod.Get.Method)
            {
                Response.Redirect("/page_not_found");
                return Json("Deny Get Request", JsonRequestBehavior.AllowGet);
            }
            else
                return Json(PrescriptionDTO.Instant.CreatePrescription(data), JsonRequestBehavior.AllowGet);
        }
    }
}