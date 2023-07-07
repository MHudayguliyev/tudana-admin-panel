import { MaterialList } from "@app/api/Types/queryReturnTypes";

export function getBaseUrl(subDestination: string) {
const url = import.meta.env.VITE_API_MODE === 'development' ? 
               import.meta.env.VITE_API_LOCAL_MEDIA_URL : 
               import.meta.env.VITE_API_SERVER_MEDIA_URL
   return `${url}/${subDestination}`
}

export function capitalize(str: string) {
   return str.split(' ').map(item => item[0].toUpperCase() + item.substring(1, item.length)).join(' ')
}

export const toRem = (value: number): string => {
   return (value / 16) + 'rem';;
}

export const setCookie = (name: string, value: string, days: number) => {
   var expires = "";
   if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
   }
   document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export const getCookie = (name: string) => {
   var nameEQ = name + "=";
   var ca = document.cookie.split(';');
   for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
   }
   return null;
}

export const convertToValidDatePostgresqlTimestamp = (date: string) => {
   const res = date.split(/\D/);
   return `${res[2]}.${res[1]}.${res[0]} ${res[3]}:${res[4]}`
}

export const convertToValidDateForInputField = (date: string) => {
   const res = date.split(/\D/);
   return `${res[0]}-${res[1]}-${res[2]}T${res[3]}:${res[4]}`
}

export const isEmpty = (value: any) => {
   if (typeof value === 'string')
      return value.trim() === ''
   else
      return isNaN(value) || value === null || value === undefined
}

export const isSelectedMaterial = (material: MaterialList, data: MaterialList, sec:boolean = false) => {
   if(sec){
      return material.line_row_id_front === data.line_row_id_front
   }else {
      return material.row_id === data.row_id
   }
}

export const sortArray = (array: any, key: string, sortBy: string) => {
   let response: any = []
   if(array){
     if(sortBy === 'ASC'){
       response = array.slice(0)
       response.sort((a: any, b: any) => a[key] < b[key] ? 1 : -1)
       return response
     }else if(sortBy === 'DESC'){
       response = array.slice(0)
       response.sort((a: any, b: any) => a[key] > b[key] ? 1 : -1)
       return response
     }
   }
}

export const getDate = (date?: any) => {
   let startDate, endDate;
   if(!date){
      const date = new Date()
      startDate = new Date(date.getFullYear(), date.getMonth(), 1)
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
   }else {
      startDate = new Date(date.getFullYear(), date.getMonth(), 1)
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
   }

   return {startDate, endDate}
}
