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
    public class managerController : Controller
    {
        struct HealthRecordTemp
        {
            public int IdHealthRecord;
            public Nullable<System.DateTime> CreateAt;
            public int CreateByUser;
            public string CreateByUser_Name;
            public double ExaminationFee;
            public Nullable<bool> IsReExamination;
            public Nullable<int> UpdateByUser;
            public string UpdateByUser_Name;
            public int IdPatient;
            public string Patient_Name;
            public string Symptom;
            public string Diagnosis;
            public Nullable<int> IndexOfDay;
            public Nullable<bool> missCall;
            public Nullable<bool> Status;
            public Nullable<System.DateTime> ReExaminationAt;
        }

        // GET: manager
        public ActionResult profile()
        {
            return View();
        }

        public ActionResult setting()
        {
            return View();
        }

        public ActionResult users()
        {
            return View();
        }

        public ActionResult detail_user()
        {
            return View();
        }

        public ActionResult statistical()
        {
            return View();
        }

        // METHOD
        public JsonResult setPass(Account acc)
        {
            if (HttpContext.Request.HttpMethod == HttpMethod.Get.Method)
            {
                Response.Redirect("/page_not_found");
                return Json("Deny Get Request", JsonRequestBehavior.AllowGet);
            }
            else
                return Json(AccountDTO.Instant.SetPass(acc), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getAccounts()
        {
            return Json(AccountDTO.Instant.GetAccounts(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult getAccountById(int id)
        {
            return Json(AccountDTO.Instant.GetAccountById(id), JsonRequestBehavior.AllowGet);
        }

        public JsonResult setStatus(int id)
        {
            if (HttpContext.Request.HttpMethod == HttpMethod.Get.Method)
            {
                Response.Redirect("/page_not_found");
                return Json("Deny Get Request", JsonRequestBehavior.AllowGet);
            }
            else
                return Json(AccountDTO.Instant.SetStatus(id), JsonRequestBehavior.AllowGet);
        }

        public JsonResult reSetPass(int id)
        {
            if (HttpContext.Request.HttpMethod == HttpMethod.Get.Method)
            {
                Response.Redirect("/page_not_found");
                return Json("Deny Get Request", JsonRequestBehavior.AllowGet);
            }
            else
                return Json(AccountDTO.Instant.ReSetPassById(id), JsonRequestBehavior.AllowGet);
        }

        public JsonResult setAccount(Account data)
        {
            if (HttpContext.Request.HttpMethod == HttpMethod.Get.Method)
            {
                Response.Redirect("/page_not_found");
                return Json("Deny Get Request", JsonRequestBehavior.AllowGet);
            }
            else
                return Json(AccountDTO.Instant.SetAccount(data), JsonRequestBehavior.AllowGet);
        }

        public JsonResult createAccount(Account data)
        {
            if (HttpContext.Request.HttpMethod == HttpMethod.Get.Method)
            {
                Response.Redirect("/page_not_found");
                return Json("Deny Get Request", JsonRequestBehavior.AllowGet);
            }
            else
                return Json(AccountDTO.Instant.createAccount(data), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getExaminationFee()
        {
            return Json(ConstantDTO.Instant.GetExaminationFee(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult setExaminationFee(Constant data)
        {
            if (HttpContext.Request.HttpMethod == HttpMethod.Get.Method)
            {
                Response.Redirect("/page_not_found");
                return Json("Deny Get Request", JsonRequestBehavior.AllowGet);
            }
            else
                return Json(ConstantDTO.Instant.SetExaminationFee(data), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getHealthRecordsByIdUser(int id)
        {
            List<HealthRecordTemp> list = new List<HealthRecordTemp>();
            List<HealthRecord> data = HealthRecordDTO.Instant.GetHealthRecordsByIdUser(id);

            foreach (HealthRecord item in data)
            {
                HealthRecordTemp tmp = new HealthRecordTemp();
                tmp.IdHealthRecord = item.IdHealthRecord;
                tmp.CreateAt = item.CreateAt;
                tmp.CreateByUser = item.CreateByUser;
                tmp.CreateByUser_Name = AccountDTO.Instant.GetAccountNameById(tmp.CreateByUser);
                tmp.ExaminationFee = item.ExaminationFee;
                tmp.IsReExamination = item.IsReExamination;
                tmp.UpdateByUser = item.UpdateByUser;
                tmp.UpdateByUser_Name = AccountDTO.Instant.GetAccountNameById(tmp.UpdateByUser);
                tmp.IdPatient = item.IdPatient;
                tmp.Patient_Name = PatientDTO.Instant.GetPatientNameById(tmp.IdPatient);
                tmp.Symptom = item.Symptom;
                tmp.Diagnosis = item.Diagnosis;
                tmp.IndexOfDay = item.IndexOfDay;
                tmp.missCall = item.missCall;
                tmp.Status = item.Status;
                list.Add(tmp);
            }

            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getCountPatients()
        {
            return Json(PatientDTO.Instant.GetCountPatients(), JsonRequestBehavior.AllowGet);
        }
    }
}