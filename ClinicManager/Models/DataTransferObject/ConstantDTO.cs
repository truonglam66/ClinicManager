using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClinicManager.Models.DataTransferObject
{
    public class ConstantDTO
    {
        private static ConstantDTO _instant;
        public static ConstantDTO Instant
        {
            get
            {
                if (_instant == null)
                    _instant = new ConstantDTO();
                return _instant;
            }
            set
            {
                _instant = value;
            }
        }

        public Constant GetExaminationFee()
        {
            return DataProvider.Instant.DB.Constants.FirstOrDefault();
        }

        public string SetExaminationFee(Constant data)
        {
            Constant cons = DataProvider.Instant.DB.Constants.Where(x => x.IdConstant == data.IdConstant).FirstOrDefault();
            cons.Value = data.Value;
            DataProvider.Instant.DB.SaveChanges();
            return "success";
        }
    }
}