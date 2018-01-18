import * as d3 from "d3";
import * as UtilFunction from './util/functions';

export const getData = () => d3.json("https://api.coindesk.com/v1/bpi/historical/close.json", function(error, lastThirty) {
  if(error){
    console.log(error);
  }else {
    console.log(lastThirty);
    window.sample = lastThirty.bpi;
    let lastThirtyData = UtilFunction.dataTransform(lastThirty.bpi);
    window.sample2 = lastThirtyData;
    showData(lastThirtyData);

    console.log(lastThirtyData);
  }
});

const showData = (data) => {
let canvas = d3.select('#example').append('svg')
  .attr('width', 1000)
  .attr('height', 700)
  .attr('cx', 500)
  .attr('cy', 500)
  .style('background', '#66666c');

  canvas.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("width", function(d) {return 20;})
  .attr("height", function(d) {return (d.close)/100;})
  .attr("x", function(d, i){return i * 30;})
  .attr("y", -1)
  .attr("full", function(d) {return UtilFunction.getRandomColor();});
  return data;




};
