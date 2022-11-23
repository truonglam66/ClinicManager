using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClinicManager.Models.DataTransferObject
{
    public class PrescriptionDTO
    {
        private static PrescriptionDTO _instant;
        public static PrescriptionDTO Instant
        {
            get
            {
                if (_instant == null)
                    _instant = new PrescriptionDTO();
                return _instant;
            }
            set
            {
                _instant = value;
            }
        }

        #region GET

        public List<Prescription> GetPrescriptionByIdHealthRecord(int id)
        {
            return DataProvider.Instant.DB.Prescriptions.Where(x => x.IdHealthRecord == id).ToList();
        }

        #endregion

        #region POST

        public string CreatePrescription(List<Prescription> data)
        {
            if (data != null)
            {
                int index = 0;
                foreach (Prescription item in data)
                {
                    item.IdHealthRecord = data[index].IdHealthRecord;
                    item.MedicineName = data[index].MedicineName;
                    item.Unit = data[index].Unit;
                    item.Count = data[index].Count;
                    item.UserManual = data[index].UserManual;

                    DataProvider.Instant.DB.Prescriptions.Add(item);
                    index++;
                }

                DataProvider.Instant.DB.SaveChanges();
            }

            return "success";
        }

        #endregion
    }
}