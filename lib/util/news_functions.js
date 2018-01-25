import * as UtilFunction from './functions';


export const topWords = (x, counter) => {
  x = 10;
  let top = [], values;
  let sorted = counter.sort( function(a,b){
    return b.count - a.count;
  });

  counter.forEach(el =>{
    top.push(el.count);
  });

  top.sort(function(a,b) { return b - a;});
  top = top.filter( UtilFunction.onlyUnique);

  top = top.slice(0,12);

  let result = [];

  counter.forEach(data => {
    if(top.includes(data.count)){
      result.push(data);
    }
  });
  return result;

};