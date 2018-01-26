import * as d3 from "d3";


export function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


export const deleteShortWords = (array) => {
  let filteredWords = [];
  let shortwords = ['the', 'it', 'is', 'we', 'all',
  'a', 'an', 'by', 'to', 'you', 'me', 'he', 'she',
   'they', 'we', 'how', 'it', 'i', 'are', 'to', 'for', 'of','that','from', 'this', 'from',
   'with', 'just', 'your', 'about', 'like', 'read', 'some', 'will', 'which', 'have', 'when',
   'after', 'down', 'been', 'once', 'come', 'what', 'time', 'things','@thomas👉', 'page.',
   'hvper.com'
 ];
  array.forEach(word => {
    if(word.length <= 3 || word[0] === "$" || shortwords.includes(word) || !isNaN(parseInt(word)) ){
      return;
    }
    filteredWords.push(word);
  });
  return filteredWords;
};




export const lowerCase = (array) => {
  var sorted = [];
  for (var i = 0; i < array.length; i++) {
      sorted.push(array[i].toLowerCase());
  }
  return sorted.sort();
};


export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}






export const dataTransform = (data) => {
  let result = [];
  let date;
  let format;
  let i = 0;
  let test;
  Object.keys(data).forEach( key => {
    date = new Date(key.replace(/-/g, '\/'));
    // format = d3.timeFormat("%m/%d/%Y");
    // date = format(date);
    result[i] = {id: i, date: date, close: data[key] };
    i = i + 1;
  });
  return result;
};



export const datesRanges = (option) => {

  let todayDateObject = new Date();
  let startDate = todayDateObject;
  let today = inputProperDate(todayDateObject);
  let endDate = today;
  switch (option) {
    case "All":
    startDate = new Date(2010,6,18);
    break;
    case "5y":
    startDate.setFullYear(todayDateObject.getFullYear()- 5);
    break;
    case "1y":
    startDate.setFullYear(todayDateObject.getFullYear()- 1);
    break;
    case "6m":
    startDate.setDate(todayDateObject.getDate()-180);
    break;
    case "3m":
    startDate.setDate(todayDateObject.getDate()-90);
    break;
    case "1m":
    startDate.setDate(todayDateObject.getDate()-30);
    break;
    case "15d":
    startDate.setDate(todayDateObject.getDate()-15);
    break;
  }
  startDate = inputProperDate(startDate);
  return [startDate, endDate];
};



const inputProperDate = (date) => {
  const format = d3.timeFormat("%Y-%m-%d");
  const newDate = format(date);
  return newDate;
};


export const renderNiceTimeDate = (dateTime) => {
  let date = new Date(dateTime);
  const showTime = renderTime(date);
  const showDate = renderDate(date);
  return [showTime, showDate];
};



export const renderTime  = (date) => {
  date = new Date(date);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  seconds = seconds < 10 ?'0' + seconds :seconds;
  const strTime = hours + ':' + minutes +  ':' + seconds + ' ' + ampm;
  return strTime;
};



export const renderTimeHoursMinutes = (date) => {
  date = new Date(date);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;

};


const renderDate = (date) => {
  let monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const day = date.getDate();
  let string = `${month} ${day}, ${year}`;
  return string;
};


export const numberWithCommas = (x) => {
  x = parseFloat(x);
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatToCurrency = (number) => {
  number = parseFloat(number);
  return "$" + number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
};



export const nytImesBitCoin = (date, range) => {
  let startDate = new Date (date);
  let endDate = new Date (date);
  startDate.setDate(startDate.getDate()- 2);
  endDate.setDate(endDate.getDate() + 2);
  startDate = nyTimesDate(startDate);
  endDate = nyTimesDate(endDate);
  return [startDate, endDate];
};


export const nyTimesDate = (date) => {
  date = new Date (date);
  let year = date.getFullYear(),
  month = (date.getMonth() % 12) + 1,
  day = date.getDate();
  month = month < 10 ? '0'+ month : month;
  day = day < 10 ? '0'+ day : day;

  return year + month + day;
};


export const googleDate = (timeDate) => {
  let dateObj = new Date(timeDate);
  let month = dateObj.getUTCMonth() + 1; //months from 1-12
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();
  month = month < 10 ? '0'+ month : month;
  day = day < 10 ? '0'+ day : day;

  let newdate = year + "-" + month + "-" + day;
  return newdate;
};
