import * as d3 from "d3";
export const renderdateNews = (data) => {
  window.newsdata = data;
  let width = 800,
  height = 800;
  let div = d3.select("#newsVis");
  div.selectAll("*").remove();
  let svg = d3.select("#newsVis").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)");
    let max = data[0].count;
    let min = data[data.length-1].count;
    let radiusScale = d3.scaleSqrt().domain([min, max]).range([10,100]);

    let simulation = d3.forceSimulation()
    .force("x", d3.forceX(width/2).strength(0.05))
    .force("y", d3.forceY(height/2).strength(0.05))
    .force("collide", d3.forceCollide( function(d){
      return radiusScale(d.count);
    }));

    let circles = svg.selectAll(".words")
    .data(data)
    .enter()
    .append('circle')
    .attr("class", "words")
    .attr("r", function(d){
      return radiusScale(d.count);
    })
    .attr("fill", "steelblue")
    .attr("cx", 100)
    .attr("cy", 100);

    let texts = svg.selectAll(null)
        .data(data)
        .enter()
        .append('text')
        .text(d => d.word)
        .attr('color', 'black')
        .attr('font-size', 15);

  let nodes = simulation.nodes(data)
      .on('tick', ticked);

      function ticked() {
        circles
          .attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d){
            return d.y;
          });

      texts.attr('x', (d) => {
          return d.x - 5;
      })
      .attr('y', (d) => {
          return d.y;
      });

      }
};
