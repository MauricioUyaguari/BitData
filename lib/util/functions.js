import * as d3 from "d3";

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
