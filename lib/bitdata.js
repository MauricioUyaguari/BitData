var Papa = require('papaparse');
import * as d3 from "d3";
import * as UtilFunction from './util/functions';
import * as lastMonth from './lastMonth';


window.d3 = d3;


// document.addEventListener('DOMContentLoaded', function () {

  // lastMonth.getData();

// });




const divButtons = document.querySelector(".div-buttons");
// window.hi = divButtons;


divButtons.addEventListener("click", (e) => {
  const buttonChoice = e.target.innerHTML;
  renderBitData(buttonChoice);

});





const renderBitData = (rangeDateInput) => {
  const ranges = UtilFunction.datesRanges(rangeDateInput),
  startDate = ranges[0],
  endDate = ranges[1],
  apiHost = "https://api.coindesk.com/v1/bpi/historical/close.json?start=",
  url = apiHost + startDate + "&end=" + endDate;
  d3.json(url, function(error, data) {
    if(error){
      console.log(error);
    }else {
      data = UtilFunction.dataTransform(data.bpi);
      renderBitChart(data, rangeDateInput);
    }
  });
};



  renderBitData("15d");


const renderBitChart = (data, range) => {
window.data = data;


let svg = d3.select("#showData-svg");
  svg.selectAll("*").remove();

  let margin = {top: 80, right: 50, bottom: 30, left: 40},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let y = d3.scaleLinear()
  .rangeRound([height, 0])
  .domain(d3.extent(data, function(d) { return d.close ; })  )
  .nice();

  g.append("g")
      .call(d3.axisLeft(y).ticks(20))
      .append("text")
      .attr("fill", "gray")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Close Price ($)");


      let x = d3.scaleTime()
        .rangeRound([0, width])
        .domain(d3.extent(data, function(d) { return d.date; }));
        // .nice();

      g.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
      let line = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.close); });
        let path = g.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5)
          .attr("d", line);

      const circle = g.append("circle")
        .attr("cx", 100)
        .attr("cy", 350)
        .attr("r", 3)
          .attr("fill", "red");

      const pathEl = path.node();
      const pathLength = pathEl.getTotalLength();
      const BBox = pathEl.getBBox();
      const scale = pathLength/BBox.width;
      const offsetLeft = document.getElementById("showData").offsetLeft + margin.left;
      window.pathLength = pathLength;




      svg.on("mousemove", function() {
        x = d3.event.pageX - offsetLeft;
        if(x< 0 || x > 900 - margin.right - margin.left){
           return null;
        }
        let beginning = x,
        end = pathLength,
        pos,
        target;
        while (true) {
          debugger
          target = Math.floor((beginning + end) / 2);
          pos = pathEl.getPointAtLength(target);
          if ((target === end || target === beginning) && pos.x !== x) {
              break;
          }
          if (pos.x > x)      end = target;
          else if (pos.x < x) beginning = target;
          else                break; //position found
          }
        circle
          .attr("opacity", 1)
          .attr("cx", x)
          .attr("cy", pos.y);
        });

        // function mousemove() {
        //   let x0 = x.invert(d3.mouse(this)[0]),
        //     i = bisectDate(data, x0, 1),
        //     d0 = data[i - 1],
        //     d1 = data[i],
        //     d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        // focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
        // focus.select("text").text(formatCurrency(d.close));
        // }


          g.exit().remove();

};





const renderCurrentBitData = () => d3.json("https://api.coindesk.com/v1/bpi/currentprice.json", function(error, data) {
  if(error){
    console.log(error);
  }else {
    window.currentprice = data;
    renderCurrent(data);
  }
});


const renderCurrent = (data) => {
  console.log("hello");
  const dateTime = UtilFunction.renderNiceTimeDate(data.time.updated),
  time = dateTime[0],
  date = dateTime[1];
  const price = data.bpi.USD.rate;

  const divTime = $(".bitCoinTime"),
    divDate =  $(".bitCoinDate"),
   divPrice = $('.bitCoinPrice');

   divTime.html(time);
   divDate.html(date);
   divPrice.html(` $ ${price}`);
};

renderCurrentBitData();
setInterval(function(a) {
  console.log("about to render");
  renderCurrentBitData();
}, 60000);
