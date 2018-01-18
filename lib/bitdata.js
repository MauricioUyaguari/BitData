import * as d3 from "d3";
import * as UtilFunctions from './util/functions';


document.addEventListener('DOMContentLoaded', function () {
  const exData = [
    {name: 'Ireland', income: 53000, life: 78, pop: 6378, color: 'green'},
    {name: 'England', income: 73000, life: 68, pop: 10378, color: 'blue'},
    {name: 'Ecuador', income: 33000, life: 58, pop: 3378, color: 'red'},
    {name: 'China', income: 43000, life: 48, pop: 116378, color: 'purple'},
    {name: 'USA', income: 80000, life: 38, pop: 96378, color: 'yellow'},
    {name: 'Argentina', income: 50000, life: 48, pop: 46378, color: 'orange'},
    {name: 'Canada', income: 530000, life: 38, pop: 36378, color: 'pink'}
  ];


  d3.csv("lib/test_data.csv", function(error, data) {
    if(error){
      console.log(error);
    }else {
      let bitData = data;
      console.log(data);
      window.sample = bitData[0];
      show(bitData);
    }
  });

  const show = (data) => {
    console.log(data);
    const svg = d3.select('#example').append('svg')
      .attr('width', 700)
      .attr('height', 700)
      .attr('cx', 500)
      .attr('cy', 500)
      .style('background', '#66666c');

        svg.selectAll('circle')
          .data(data)
          .enter()
          .append('circle')
          .attr('id', function(d) { return d.close;})
          .attr('cx', function(d) {return 500;})
          .attr('cy',function(d) {return 500;})
          .attr('r', function(d) {return parseInt(d.Close)/10 ;} )
          .attr('fill', function(d) {return UtilFunctions.getRandomColor();})
          .append('svg:title')
          .text(function(d) { return 'Country: ' + d.name;});

      return data;
  };





});
