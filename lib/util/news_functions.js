import * as UtilFunction from './functions';


export const topWords = (x, counter) => {
  let top = [], values;
  let sorted = counter.sort( function(a,b){
    return b.count - a.count;
  });


  return sorted;
  // counter.forEach(el =>{
  //   top.push(el.count);
  // });
  //
  // top.sort(function(a,b) { return b - a;});
  // top = top.filter( UtilFunction.onlyUnique);
  //
  // top = top.slice(0,x);
  //
  // let result = [];
  //
  // counter.forEach(data => {
  //   if(top.includes(data.count)){
  //     result.push(data);
  //   }
  // });
  // return result;

};



export const arrayOfWords = (docs) => {
  let result = [];
  let timesHeadlines = [];
  let headline, title, headlineString;
  docs.forEach( info => {
    headlineString = (info.description + info.title).split(" ");
    headlineString = headlineString.filter(UtilFunction.onlyUnique);
    headlineString = UtilFunction.lowerCase(headlineString);
    headlineString = UtilFunction.deleteShortWords(headlineString);
    result = result.concat(headlineString);
  });
  return result;
};

export const objectCounter = (arrayWords) => {
  let uniqueWords = arrayWords.filter(UtilFunction.onlyUnique);
  let result = [];
  let temp ;
  let count;
  uniqueWords.forEach(word => {
    temp = {};
    count = countInArray(arrayWords, word);
    temp["word"] = word;
    temp["count"] = count;
    result.push(temp);
  });
  return result;
};



const countInArray = (array, what) => {
  return array.filter(item => item == what).length;

};
