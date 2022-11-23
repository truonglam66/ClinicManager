using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClinicManager.Models.DataTransferObject
{
    public class PatientDTO
    {
        private static PatientDTO _instant;
        public static PatientDTO Instant
        {
            get
            {
                if (_instant == null)
                    _instant = new PatientDTO();
                return _instant;
            }
            set
            {
                _instant = value;
            }
        }

        #region POST
        public int CreatePatient(Patient data)
        {
            DateTime d = DateTime.Now;
            data.CreateAt = d;
            DataProvider.Instant.DB.Patients.Add(data);
            DataProvider.Instant.DB.SaveChanges();
            return DataProvider.Instant.DB.Patients.Where(x => x.IdentityCardNumber == data.IdentityCardNumber).SingleOrDefault().IdPatient;
        }
        #endregion

        #region GET
        public List<Patient> GetPatients()
        {
            return DataProvider.Instant.DB.Patients.OrderByDescending(x => x.CreateAt).ToList();
        }

        public int GetCountPatients()
        {
            return DataProvider.Instant.DB.Patients.Count();
        }

        public Patient GetPatientById(int id)
        {
            return DataProvider.Instant.DB.Patients.Where(x => x.IdPatient == id).FirstOrDefault();
        }

        public string GetPatientNameById(int id)
        {
            //return DataProvider.Instant.DB.Patients.Where(x => x.IdPatient == id).First().Name;
            return "0";
        }

        public Patient GetPatientByIdentityCardNumber(string number)
        {
            return DataProvider.Instant.DB.Patients.Where(x => x.IdentityCardNumber == number).FirstOrDefault();
        }
        #endregion

        #region PUT
        public void UpdatePatient(Patient patientObj)
        {
            Patient patient = DataProvider.Instant.DB.Patients.Where(x => x.IdPatient == patientObj.IdPatient).FirstOrDefault();
            patient.Name = patientObj.Name;
            patient.DateOfBirth = patientObj.DateOfBirth;
            patient.Gender = patientObj.Gender;
            DataProvider.Instant.DB.SaveChanges();
        }
        #endregion
    }
}