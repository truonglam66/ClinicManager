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
    public class receptionistController : Controller
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

        // GET: receptionist

        public ActionResult set_the_order()
        {
            return View();
        }

        public ActionResult reexamination()
        {
            return View();
        }

        public ActionResult new_health_record()
        {
            return View();
        }

        // METHOD
        public JsonResult setTheOrderById(int id)
        {
            if (HttpContext.Request.HttpMethod == HttpMethod.Get.Method)
            {
                Response.Redirect("/page_not_found");
                return Json("Deny Get Request", JsonRequestBehavior.AllowGet);
            }
            else
                return Json(HealthRecordDTO.Instant.SetTheOrderById(id), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getHealthRecordsHaveReExamination()
        {
            List<HealthRecordTemp> list = new List<HealthRecordTemp>();
            List<HealthRecord> data = HealthRecordDTO.Instant.GetHealthRecords();

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
                tmp.ReExaminationAt = ReExaminationDTO.Instant.GetReExaminationAtByIdHealthRecord(tmp.IdHealthRecord);
                if (tmp.ReExaminationAt != null)
                    list.Add(tmp);
            }

            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getHealthRecordsToDay()
        {
            List<HealthRecordTemp> list = new List<HealthRecordTemp>();
            List<HealthRecord> data = HealthRecordDTO.Instant.GetHealthRecordsToDay();

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

        public JsonResult setReExamination(ReExamination data)
        {
            if (HttpContext.Request.HttpMethod == HttpMethod.Get.Method)
            {
                Response.Redirect("/page_not_found");
                return Json("Deny Get Request", JsonRequestBehavior.AllowGet);
            }
            else
                return Json(ReExaminationDTO.Instant.SetReExamination(data), JsonRequestBehavior.AllowGet);
        }

        public JsonResult createPatient(Patient data)
        {
            if (HttpContext.Request.HttpMethod == HttpMethod.Get.Method)
            {
                Response.Redirect("/page_not_found");
                return Json("Deny Get Request", JsonRequestBehavior.AllowGet);
            }
            else
                return Json(PatientDTO.Instant.CreatePatient(data), JsonRequestBehavior.AllowGet);
        }

        public JsonResult createHealthRecord(HealthRecord data)
        {
            if (HttpContext.Request.HttpMethod == HttpMethod.Get.Method)
            {
                Response.Redirect("/page_not_found");
                return Json("Deny Get Request", JsonRequestBehavior.AllowGet);
            }
            else
                return Json(HealthRecordDTO.Instant.createHealthRecord(data), JsonRequestBehavior.AllowGet);
        }
    }
}