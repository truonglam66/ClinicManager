using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ClinicManager.Models.DataTransferObject
{
    public class DataProvider
    {
        private static DataProvider _instant;
        public static DataProvider Instant
        {
            get
            {
                if (_instant == null)
                    _instant = new DataProvider();
                return _instant;
            }
            set
            {
                _instant = value;
            }

        }
        public ClinicManagerEntities DB { get; set; }
        private DataProvider()
        {
            DB = new ClinicManagerEntities();
        }
    }
}