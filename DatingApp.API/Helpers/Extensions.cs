using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DatingApp.API.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string errorMessage)
        {
            response.Headers.Add("Application-Error", errorMessage);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public static int CalculateAge(this DateTime dateTime)
        {
            var age = DateTime.Today.Year - dateTime.Year;
            if (dateTime.AddYears(age) > DateTime.Today)
                age--;
            return age;
        }

        public static void Pagination(this HttpResponse response, int currentPage,
            int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);
             
            /* below two lines of code is used to format the header as camelCase,
             * in order for angular to utilize it; as angular wwon't utilize the default formatter
             * i.e. PascalCase */ 
            var formatter = new JsonSerializerSettings();
            formatter.ContractResolver = new CamelCasePropertyNamesContractResolver();   

            response.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader, formatter));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination"); // this is added to do with CORS error 
        }
    }
}