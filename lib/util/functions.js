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
  let i = 0;
  Object.keys(data).forEach( key => {
    date = new Date(key);
    result[i] = {id: i, date: date, close: data[key] };
    i = i + 1;
  });
  return result;
};
