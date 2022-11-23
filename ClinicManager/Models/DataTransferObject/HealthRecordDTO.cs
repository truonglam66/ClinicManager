    using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace ClinicManager.Models.DataTransferObject
{
    public class HealthRecordDTO
    {
        private static HealthRecordDTO _instant;
        public static HealthRecordDTO Instant
        {
            get
            {
                if (_instant == null)
                    _instant = new HealthRecordDTO();
                return _instant;
            }
            set
            {
                _instant = value;
            }
        }

        #region GET
        public List<HealthRecord> GetHealthRecords()
        {
            return DataProvider.Instant.DB.HealthRecords.OrderByDescending(x => x.CreateAt).ToList();
        }

        public List<HealthRecord> GetHealthRecordsToDay()
        {
            DateTime d = DateTime.Now;
            return DataProvider.Instant.DB.HealthRecords.Where(x => EntityFunctions.TruncateTime(x.CreateAt) == d.Date).OrderByDescending(x => x.CreateAt).ToList();
        }

        public HealthRecord GetHealthRecordById(int id)
        {
            return DataProvider.Instant.DB.HealthRecords.Where(x => x.IdHealthRecord == id).SingleOrDefault();
        }

        public List<HealthRecord> GetHealthRecordsByIdPatient(int id)
        {
            return DataProvider.Instant.DB.HealthRecords.Where(x => x.IdPatient == id).ToList();
        }

        public List<HealthRecord> GetHealthRecordsByIdUser(int id)
        {
            return DataProvider.Instant.DB.HealthRecords.Where(x => x.CreateByUser == id || x.UpdateByUser == id).ToList();
        }

        public int CountHealthRecordsByIdPatient(int id)
        {
            return DataProvider.Instant.DB.HealthRecords.Where(x => x.IdPatient == id).ToList().Count;
        }

        public double GetTotalFeeByIdPatient(int id)
        {
            return DataProvider.Instant.DB.HealthRecords.Where(x => x.IdPatient == id).ToList().Sum(x => x.ExaminationFee);
        }

        public List<HealthRecord> GetQueuesHealthRecords()
        {
            DateTime d = DateTime.Now;
            return DataProvider.Instant.DB.HealthRecords.Where(x => x.Status == true && x.missCall == false && EntityFunctions.TruncateTime(x.CreateAt) == d.Date).OrderBy(x => x.IndexOfDay).Take(10).ToList();
        }

        public List<HealthRecord> GetMissCallsHealthRecords()
        {
            DateTime d = DateTime.Now;
            return DataProvider.Instant.DB.HealthRecords.Where(x => (x.Status == true) && (x.missCall != false) && (EntityFunctions.TruncateTime(x.CreateAt) == d.Date)).OrderBy(x => x.IndexOfDay).Take(10).ToList();
        }

        public int? GetNextIndexOfDay()
        {
            DateTime d = DateTime.Now;
            int? max = DataProvider.Instant.DB.HealthRecords.Where(x => EntityFunctions.TruncateTime(x.CreateAt) == d.Date).Select(x => x.IndexOfDay).Max();
            if (max == null)
            {
                return 1;
            } else
            {
                return max + 1;
            }
        }

        #endregion

        #region POST

        public string SetTheOrderById(int id)
        {
            HealthRecord healthRecord = DataProvider.Instant.DB.HealthRecords.Where(x => x.IdHealthRecord == id).SingleOrDefault();
            healthRecord.missCall = !healthRecord.missCall;
            DataProvider.Instant.DB.SaveChanges();

            return "success";
        }

        public string createHealthRecord(HealthRecord data)
        {
            HealthRecord item = new HealthRecord();

            DateTime d = DateTime.Now;

            item.CreateAt = d;
            item.CreateByUser = data.CreateByUser;
            item.ExaminationFee = data.ExaminationFee;
            item.IsReExamination = data.IsReExamination;
            item.IdPatient = data.IdPatient;
            item.missCall = false;
            item.Status = true;
            item.IndexOfDay = HealthRecordDTO.Instant.GetNextIndexOfDay();
            item.Symptom = null;
            item.Diagnosis = null;
            item.UpdateByUser = null;

            DataProvider.Instant.DB.HealthRecords.Add(item);
            DataProvider.Instant.DB.SaveChanges();

            return "success";
        }

        public string SetHealthRecord(HealthRecord data)
        {
            HealthRecord item = HealthRecordDTO.Instant.GetHealthRecordById(data.IdHealthRecord);

            item.Symptom = data.Symptom;
            item.Diagnosis = data.Diagnosis;
            item.UpdateByUser = data.UpdateByUser;
            item.Status = false;

            DataProvider.Instant.DB.SaveChanges();

            return "success";
        }

        #endregion
    }
}