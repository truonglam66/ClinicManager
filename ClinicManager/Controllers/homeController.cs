using ClinicManager.Models;
using ClinicManager.Models.DataTransferObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ClinicManager.Controllers
{
    
    public class homeController : Controller
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

        // RERURN SCREEN: home
        public ActionResult Index()
        {
            return View();
        }

        // METHOD
        public JsonResult getQueues()
        {
            List<HealthRecordTemp> list = new List<HealthRecordTemp>();
            List<HealthRecord> data = HealthRecordDTO.Instant.GetQueuesHealthRecords();

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

        public JsonResult getMissCalls()
        {
            List<HealthRecordTemp> list = new List<HealthRecordTemp>();
            List<HealthRecord> data = HealthRecordDTO.Instant.GetMissCallsHealthRecords();

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
    }
}