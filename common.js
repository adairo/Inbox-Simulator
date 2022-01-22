export {getTimeString, getDateString};

function getTimeString(date, format = 12) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let AM = false;
 
    if (format === 12) {
 
       if (hours >= 0 && hours <= 11)
          AM = true;
 
 
       if (hours === 0)
          hours = 12;
 
       if (hours > 12)
          hours %= 12;
    }
 
    if (hours < 10)
       hours = "0" + hours;
    if (minutes < 10)
       minutes = "0" + minutes;
 
    if (format === 12)
       return `${hours}:${minutes} ${AM ? 'AM' : 'PM'}`;
    return `${hours}:${minutes}`;
 }
 
 function getDateString(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // return a number between 0-11
    let day = date.getDate();
 
    if (month < 10)
       month = '0' + month;
 
    if (day < 10)
       day = '0' + day;
 
    return `${year}-${month}-${day}`;
 }