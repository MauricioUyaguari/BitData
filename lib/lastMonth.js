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

   d3.select('#example').append('svg')
    .attr('width', 1000)
    .attr('height', 700);

    let svg = d3.select("svg"),
    margin = {top: 70, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });
    window.y = y ;
    window.x = x ;
    window.line = line ;

      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain(d3.extent(data, function(d) { return d.close; }));

      g.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
        .select(".domain")
          .remove();

      g.append("g")
          .call(d3.axisLeft(y))
        .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Price ($)");

      g.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5)
          .attr("d", line);
  return data;
};



//
// let canvas = d3.select('#example').append('svg')
//   .attr('width', 1000)
//   .attr('height', 700)
//   .attr('cx', 500)
//   .attr('cy', 500)
//   .style('background', '#66666c');
//
// canvas.selectAll("rect")
// .data(data)
// .enter()
// .append("rect")
// .attr("width", function(d) {return 20;})
// .attr("height", function(d) {return (d.close)/100;})
// .attr("x", function(d, i){return i * 30;})
// .attr("y", -1)
// .attr("full", function(d) {return UtilFunction.getRandomColor();});
